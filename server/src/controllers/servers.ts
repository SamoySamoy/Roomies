import { Response } from 'express';
import { db } from '@/prisma/db';
import { MemberRole, Server, ServerType } from '@prisma/client';
import { isTruthy, uuid } from '@/lib/utils';
import bcrypt from 'bcrypt';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { AuthenticatedRequest } from '@/lib/types';

type QueryInclude = {
  profile: string;
  members: string;
  channels: string;
};

type QueryFilter = {
  profileId: string;
  status: 'created' | 'joined';
  serverType: ServerType | 'viewable' | 'all';
};

// Get all servers
export const getServers = async (
  req: AuthenticatedRequest<any, any, Partial<QueryInclude & QueryFilter>>,
  res: Response,
) => {
  try {
    const {
      profile,
      members,
      channels,
      profileId,
      status = 'joined',
      serverType = 'all',
    } = req.query;

    // Tìm kiếm theo 2 điều kiện độc lập
    // 1. Tìm kiếm theo kiểu server
    let serverTypeFilterList: ServerType[] = [serverType.toUpperCase() as ServerType];
    if (serverType === 'viewable') {
      serverTypeFilterList = [ServerType.PUBLIC, ServerType.PRIVATE];
    }
    if (serverType === 'all') {
      serverTypeFilterList = Object.keys(ServerType) as ServerType[];
    }

    // 2. Tìm kiếm theo cá nhân (profileId) hoặc không
    // Nếu có profileId, sẽ có 2 trạng thái tìm kiếm: tìm kiếm những server mà profileId join và tìm kiếm những server mà profileId create
    let profileIdFilter = {};
    if (profileId) {
      profileIdFilter =
        status === 'joined'
          ? {
              members: {
                some: {
                  profileId,
                },
              },
            }
          : {
              profileId,
            };
    }

    const servers = await db.server.findMany({
      where: {
        AND: [
          profileIdFilter,
          {
            type: {
              in: serverTypeFilterList,
            },
          },
        ],
      },
      include: {
        profile: isTruthy(profile),
        members: isTruthy(members),
        channels: isTruthy(channels),
      },
    });

    return res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

type ParamsServerId = {
  serverId: string;
};
// Get a server by serverId
export const getServerByServerId = async (
  req: AuthenticatedRequest<ParamsServerId, any, Partial<QueryInclude>>,
  res: Response,
) => {
  try {
    const serverId = req.params.serverId;
    const { profile, members, channels } = req.query;
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        profile: isTruthy(profile),
        members: isTruthy(members),
        channels: isTruthy(channels),
      },
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    return res.status(200).json(server);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

type BodyCreateServer = {
  serverName: string;
  serverType: ServerType;
  serverPassword: string;
};

// Create new server
export const createServer = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateServer>, any>,
  res: Response,
) => {
  try {
    const { serverName, serverPassword = '' } = req.body;
    let { serverType = 'PUBLIC' } = req.body;
    const profileId = req.user?.profileId!;

    if (!serverName || !profileId) {
      return res.status(400).json({ message: 'Need server name, type, profile id' });
    }
    serverType = serverType.toUpperCase() as ServerType;

    if (!req.file) {
      return res.status(400).json({ message: 'Require server image' });
    }

    if (!Object.keys(ServerType).includes(serverType)) {
      return res.status(400).json({ message: 'Invalid server type' });
    }
    if (serverType === 'PRIVATE' && !serverPassword) {
      return res.status(400).json({ message: 'Require password for private server' });
    }

    const profile = await db.profile.findUnique({
      where: { id: profileId },
      select: { id: true },
    });
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }

    const image = req.file;
    const imageUrl = `/public/servers/${uuid()}.webp`;
    await sharp(image.buffer)
      .resize(100, 100)
      .webp()
      .toFile(path.join(__dirname, '..', '..', imageUrl.substring(1)));
    const hashedPassword = serverType === 'PRIVATE' ? await bcrypt.hash(serverPassword, 10) : '';

    const newServer = await db.server.create({
      data: {
        name: serverName,
        type: serverType,
        password: hashedPassword,
        imageUrl,
        inviteCode: uuid(),
        profileId: profile.id,
        members: {
          create: [{ role: MemberRole.ADMIN, profileId: profile.id }],
        },
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
      },
      include: {
        profile: true,
        members: true,
        channels: true,
      },
    });

    return res.status(200).json(newServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

type BodyJoin = {
  serverPassword: string;
};

// join server by inviteCode
export const joinServer = async (
  req: AuthenticatedRequest<ParamsServerId, Partial<BodyJoin>>,
  res: Response,
) => {
  try {
    const { serverId } = req.params;
    const { serverPassword } = req.body;
    const profileId = req.user?.profileId!;

    const [profile, server] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      db.server.findFirst({
        where: { id: serverId },
        include: {
          members: true,
        },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!server) {
      return res.status(400).json({ message: 'Server not found' });
    }
    const isAlreadyJoinServer = server.members.find(mem => mem.profileId === profile.id);
    if (isAlreadyJoinServer) {
      return res.status(200).json({ message: 'User already join this channel' });
    }

    // Có 3 loại server PUBLIC, PRIVATE, HIDDEN
    // PUBLIC: invite code || no password
    // PRIVATE: invite code || password
    // HIDDEN: invite code (chỉ có thể join bằng invite code)
    // Invite code đã có route ở dưới
    const updateServer = async () => {
      const updatedServer = await db.server.update({
        where: {
          id: server.id,
        },
        data: {
          members: {
            create: [
              {
                profileId: profile.id,
              },
            ],
          },
        },
      });
      return updatedServer;
    };
    switch (server.type) {
      case 'PUBLIC': {
        return res.status(200).json(await updateServer());
      }
      case 'PRIVATE': {
        if (!serverPassword) {
          return res.status(400).json({ message: 'Require password for private server' });
        }
        const isRightPassword = await bcrypt.compare(serverPassword, server.password!);
        if (!isRightPassword) {
          return res.status(400).json({ message: 'Unauthenticated permission for private server' });
        }
        return res.status(200).json(await updateServer());
      }
      default: {
        return res.status(400).json({ message: 'Can not join server' });
      }
    }
    // Can not join hidden server without invite code
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

type ParamsInviteCode = { inviteCode: string };

// join server by inviteCode
export const joinServerByInviteCode = async (
  req: AuthenticatedRequest<ParamsInviteCode, any, any>,
  res: Response,
) => {
  try {
    const { inviteCode } = req.params;
    const profileId = req.user?.profileId!;

    const [profile, server] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      db.server.findFirst({
        where: {
          inviteCode,
        },
        include: {
          members: true,
        },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!server) {
      return res.status(400).json({ message: 'Server not found or Invite code not exist' });
    }
    const isAlreadyJoinServer = server.members.find(mem => mem.profileId === profile.id);
    if (isAlreadyJoinServer) {
      return res.sendStatus(204);
    }

    const updatedServer = await db.server.update({
      where: {
        id: server.id,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
            },
          ],
        },
      },
    });
    return res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Leave server
export const leaveServer = async (
  req: AuthenticatedRequest<ParamsServerId, any, any>,
  res: Response,
) => {
  try {
    const { serverId } = req.params;
    const profileId = req.user?.profileId;

    const [profile, server] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      db.server.findFirst({
        where: {
          id: serverId,
        },
        include: {
          members: true,
        },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!server) {
      return res.status(400).json({ message: 'Server not exist' });
    }
    if (server.profileId === profile.id) {
      return res.status(400).json({ message: 'Can not leave server that created by yourself' });
    }

    const updatedServer = await db.server.update({
      where: {
        id: server.id,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
    return res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a server by serverId
export const updateServer = async (
  req: AuthenticatedRequest<ParamsServerId, Partial<BodyCreateServer>, any>,
  res: Response,
) => {
  try {
    const { serverId } = req.params;
    const { serverName: newServerName, serverPassword: newServerPassword = '' } = req.body;
    let { serverType: newServerType } = req.body;
    const profileId = req.user?.profileId!;

    const server = await db.server.findUnique({
      where: {
        id: serverId,
      },
    });
    if (!server) {
      return res.status(400).json({ message: 'Server not exist' });
    }
    // Only the server creatator can update server
    if (server.profileId !== profileId) {
      return res.status(400).json({ message: 'Only Admin can update server' });
    }

    const updatedData: Partial<Server> = {};

    if (newServerName) {
      updatedData.name = newServerName;
    }
    if (newServerType) {
      newServerType = newServerType.toUpperCase() as ServerType;
      if (!Object.keys(ServerType).includes(newServerType)) {
        return res.status(400).json({ message: 'Invalid server type' });
      }
      if (newServerType === 'PRIVATE' && !newServerPassword) {
        return res.status(400).json({ message: 'Require password for private server' });
      }
      const hashedPassword =
        newServerType === 'PRIVATE' ? await bcrypt.hash(newServerPassword, 10) : '';
      updatedData.password = hashedPassword;
      updatedData.type = newServerType;
    }

    if (
      req.files !== undefined &&
      Array.isArray(req.files) &&
      req.files[0]?.fieldname === 'serverImage'
    ) {
      const image = req.files[0];
      const newImageUrl = `/public/servers/${uuid()}.webp`;
      await sharp(image.buffer)
        .resize(100, 100)
        .webp()
        .toFile(path.join(__dirname, '..', '..', newImageUrl.substring(1)));
      const oldImageUrl = path.join(__dirname, '..', '..', server.imageUrl!.substring(1));
      await fs.unlink(oldImageUrl);
      updatedData.imageUrl = newImageUrl;
    }

    const updatedServer = await db.server.update({
      where: {
        id: server.id,
      },
      data: updatedData,
    });

    return res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a server by serverId
export const deleteServer = async (
  req: AuthenticatedRequest<ParamsServerId, any, any>,
  res: Response,
) => {
  try {
    const serverId = req.params.serverId;
    const profileId = req.user?.profileId!;

    const server = await db.server.findUnique({
      where: { id: serverId },
    });
    if (!server) {
      return res.status(400).json({ error: 'Server not found' });
    }
    // Only the server creatator can update server
    if (server.profileId !== profileId) {
      return res.status(403).json({ message: 'Only Admin can delete server' });
    }

    await db.server.delete({
      where: {
        id: serverId,
      },
    });

    return res.status(200).send({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

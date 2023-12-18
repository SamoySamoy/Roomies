import express, { Request, Response, Router } from 'express';
import { authToken, AuthenticatedRequest } from '../middlewares/authToken';
import { db } from '../prisma/db';
import { MemberRole, ServerType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Member, Channel } from '@prisma/client';

// Create new server
export const createServer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, imageUrl, type } = req.body;

    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }

    const profile = await db.profile.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!profile) {
      return res.status(400).json({ error: 'User email not found in token' });
    }

    const newServer = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        type,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: 'general', profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    const server = await db.server.findUnique({
      where: { id: newServer.id },
      include: {
        members: true,
        channels: true,
      },
    });

    return res.status(200).json(server);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get all servers
export const getServers = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const filter: {
      type?: ServerType;
    } = {};

    if (type) {
      filter.type = type as ServerType;
    }

    const servers = await db.server.findMany({
      where: filter,
      include: {
        members: true,
        channels: true,
      },
    });
    return res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// get all servers by userId
export const getServersByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: userId,
          },
        },
      },
      include: {
        members: true,
        channels: true,
      },
    });
    return res.status(200).json(servers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a server by serverID
export const getServerByServerId = async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    const { all, members, channels } = req.query;
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
        channels: true,
      },
    });

    const returnData: {
      members?: Member[];
      channels?: Channel[];
    } = {};

    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }
    if (all) {
      return res.status(200).json(server);
    } else {
      if (members) {
        returnData.members = server.members;
      }
      if (channels) {
        returnData.channels = server.channels;
      }
      return res.status(200).json(returnData);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a server by serverId
export const updateServer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, imageUrl, type } = req.body;
    const updatedServerData: {
      name?: string;
      imageUrl?: string;
      type?: ServerType;
    } = {};

    if (name) {
      updatedServerData.name = name;
    }

    if (imageUrl !== undefined) {
      updatedServerData.imageUrl = imageUrl;
    }

    if (type) {
      updatedServerData.type = type;
    }

    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }
    const profile = await db.profile.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    const serverId = req.params.id;
    const server = await db.server.findUnique({
      where: { id: serverId, profileId: profile?.id },
    });

    if (!server) {
      return res
        .status(404)
        .json({ error: 'Server not found or you are not admin of this server' });
    }

    const updatedServer = await db.server.update({
      where: {
        id: serverId,
      },
      data: updatedServerData,
    });

    const returnServer = await db.server.findUnique({
      where: { id: serverId },
      include: {
        members: true,
        channels: true,
      },
    });

    return res.status(200).json(returnServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a server by serverId
export const deleteServer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serverId = req.params.id;
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }
    const profile = await db.profile.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });
    const server = await db.server.findUnique({
      where: { id: serverId, profileId: profile?.id },
    });

    if (!server) {
      return res
        .status(404)
        .json({ error: 'Server not found or you are not admin of this server' });
    }
    await db.server.delete({
      where: {
        id: serverId,
      },
    });

    return res.status(202).send({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Leave server
export const leaveServer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serverId = req.params.id;
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }
    const profile = await db.profile.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    const server = await db.server.findUnique({
      where: {
        id: serverId,
        profileId: {
          not: profile?.id,
        },
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      include: {
        members: true,
        channels: true,
      },
    });
    if (!server) {
      return res.status(400).json({
        error:
          'You can not leave this server (you are the admin or you are not a member of this server)',
      });
    }
    const updateServer = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile?.id,
        },
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile?.id,
          },
        },
      },
    });
    const returnServer = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        members: true,
        channels: true,
      },
    });
    return res.status(200).json(returnServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// join server by inviteCode
export const joinServer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const serverId = req.params.id;
    const { inviteCode } = req.body;
    const userEmail = req.user?.email;
    if (!userEmail) {
      return res.status(400).json({ error: 'User email not found in token' });
    }
    const profile = await db.profile.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!profile) {
      return res.status(400).json({ error: 'You are unauthenticated' });
    }

    const isExistingServer = await db.server.findFirst({
      where: {
        inviteCode: inviteCode,
        members: {
          some: {
            profileId: profile?.id,
          },
        },
      },
    });

    if (isExistingServer) {
      return res.status(400).json({ error: 'You already in this server' });
    }

    const updateServer = await db.server.update({
      where: {
        inviteCode: inviteCode,
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
    const returnServer = await db.server.findUnique({
      where: {
        id: serverId,
      },
      include: {
        members: true,
        channels: true,
      },
    });
    return res.status(200).json(returnServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

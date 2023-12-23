import { Response } from 'express';
import { db } from '@/prisma/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { AuthenticatedRequest } from '@/lib/types';
import { isTruthy } from '@/lib/utils';

type QueryInclude = {
  messages: string;
};

type QueryFilter = {
  serverId: string;
};

export const getChannels = async (
  req: AuthenticatedRequest<any, any, Partial<QueryInclude & QueryFilter>>,
  res: Response,
) => {
  try {
    const { messages, serverId } = req.query;
    const channel = await db.channel.findMany({
      where: {
        serverId,
      },
      include: { messages: isTruthy(messages) },
    });
    return res.status(200).json(channel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

type ParamsWithChannelId = {
  channelId: string;
};

// Get a specific channel by channelId
export const getChannelById = async (
  req: AuthenticatedRequest<ParamsWithChannelId, any, Partial<QueryInclude>>,
  res: Response,
) => {
  try {
    const channelId = req.params.channelId;
    const { messages } = req.query;
    const channel = await db.channel.findUnique({
      where: { id: channelId },
      include: { messages: isTruthy(messages) },
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    return res.status(200).json(channel);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

type BodyCreateChannel = {
  channelName: string;
  channelType: ChannelType;
  serverId: string;
};

// create new channel
export const createChannel = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateChannel>, any>,
  res: Response,
) => {
  try {
    const { channelName, serverId, channelType = 'TEXT' } = req.body;
    const profileId = req.user?.profileId!;

    if (!channelName || !serverId) {
      return res.status(400).json({ message: 'Need channel name, server id' });
    }
    if (channelName === 'general') {
      return res.status(400).json({ message: 'Name can not be general' });
    }

    const [profile, server] = await Promise.all([
      await db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      await db.server.findUnique({
        where: {
          id: serverId,
          members: {
            some: {
              profileId,
              role: {
                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
              },
            },
          },
        },
      }),
    ]);

    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!server) {
      return res.status(400).json({
        error:
          'Can not create channel. Server not exist or you are not admin or moderator of this server',
      });
    }

    const isExistingChannel = await db.channel.findFirst({
      where: {
        serverId: server.id,
        name: channelName,
      },
    });
    if (isExistingChannel) {
      return res
        .status(400)
        .json({ message: 'Channel with same name already exists in this server' });
    }

    const updatedServer = await db.server.update({
      where: {
        id: server.id,
      },
      data: {
        channels: {
          create: {
            name: channelName,
            type: channelType,
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: true,
      },
    });
    return res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateChannel = async (
  req: AuthenticatedRequest<ParamsWithChannelId, Partial<BodyCreateChannel>, any>,
  res: Response,
) => {
  try {
    const profileId = req.user?.profileId!;
    const channelId = req.params.channelId;
    const { channelName } = req.body;
    let { channelType } = req.body;

    if (channelType) {
      channelType = channelType.toUpperCase() as ChannelType;
      if (!Object.keys(ChannelType).includes(channelType)) {
        return res.status(400).json({ message: 'Invalid server type' });
      }
    }

    const [profile, channel] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      await db.channel.findUnique({
        where: {
          id: channelId,
        },
        include: { messages: true },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!channel) {
      return res.status(400).json({ message: 'Channel not found' });
    }

    const server = await db.server.findUnique({
      where: {
        id: channel?.serverId,
        members: {
          some: {
            profileId: profile?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    });
    if (!server) {
      return res.status(400).json({ error: 'You are not admin or moderator of this server' });
    }

    const updatedServer = await db.server.update({
      where: {
        id: channel?.serverId,
        members: {
          some: {
            profileId: profile?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: channel.id,
            },
            data: {
              name: channelName,
              type: channelType,
            },
          },
        },
      },
      include: {
        channels: true,
      },
    });
    return res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a channel
export const deleteChannel = async (
  req: AuthenticatedRequest<ParamsWithChannelId, any, any>,
  res: Response,
) => {
  try {
    const channelId = req.params.channelId;
    const profileId = req.user?.profileId;

    const [profile, channel] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      await db.channel.findUnique({
        where: {
          id: channelId,
        },
        include: { messages: true },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!channel) {
      return res.status(400).json({ message: 'Channel not found' });
    }

    if (channel.name === 'general') {
      return res.status(400).json({ message: 'You can not delete general channel' });
    }

    const server = await db.server.findUnique({
      where: {
        id: channel?.serverId,
        members: {
          some: {
            profileId: profile?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
    });
    if (!server) {
      return res.status(400).json({ error: 'You are not admin or moderator of this server' });
    }
    const updatedServer = await db.server.update({
      where: {
        id: channel?.serverId,
        members: {
          some: {
            profileId: profile?.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channel.id,
          },
        },
      },
    });

    return res.status(200).json(updatedServer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

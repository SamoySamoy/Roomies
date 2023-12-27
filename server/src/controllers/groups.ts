import { Response } from 'express';
import { db } from '@/prisma/db';
import { GroupType, MemberRole } from '@prisma/client';
import { AuthenticatedRequest } from '@/lib/types';
import { isTruthy } from '@/lib/utils';

type QueryInclude = {
  messages: string;
  profile: string;
};

type QueryFilter = {
  roomId: string;
};

export const getGroups = async (
  req: AuthenticatedRequest<any, any, Partial<QueryInclude & QueryFilter>>,
  res: Response,
) => {
  try {
    const { messages, profile, roomId } = req.query;
    const groups = await db.group.findMany({
      where: {
        roomId,
      },
      include: { messages: isTruthy(messages), profile: isTruthy(profile) },
    });
    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server Error' });
  }
};

type ParamsWithGroupId = {
  groupId: string;
};

// Get a specific group by groupId
export const getGroupByGroupId = async (
  req: AuthenticatedRequest<ParamsWithGroupId, any, Partial<QueryInclude>>,
  res: Response,
) => {
  try {
    const groupId = req.params.groupId;
    const { messages, profile } = req.query;
    const group = await db.group.findUnique({
      where: { id: groupId },
      include: { messages: isTruthy(messages), profile: isTruthy(profile) },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    return res.status(200).json(group);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server Error' });
  }
};

type BodyCreateGroup = {
  groupName: string;
  groupType: GroupType;
  roomId: string;
};

// create new group
export const createGroup = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateGroup>, any>,
  res: Response,
) => {
  try {
    const { groupName, roomId, groupType = 'TEXT' } = req.body;
    const profileId = req.user?.profileId!;

    if (!groupName || !roomId) {
      return res.status(400).json({ message: 'Need group name, room id' });
    }
    if (groupName === 'default') {
      return res.status(400).json({ message: 'Name can not be general' });
    }

    const [profile, room] = await Promise.all([
      await db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      await db.room.findUnique({
        where: {
          id: roomId,
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
    if (!room) {
      return res.status(400).json({
        message:
          'Can not create group. Room not exist or you are not admin or moderator of this room',
      });
    }

    const isExistingGroup = await db.group.findFirst({
      where: {
        roomId: room.id,
        name: groupName,
      },
    });
    if (isExistingGroup) {
      return res.status(400).json({ message: 'Group with same name already exists in this room' });
    }

    const updatedRoom = await db.room.update({
      where: {
        id: room.id,
      },
      data: {
        groups: {
          create: {
            name: groupName,
            type: groupType,
            profileId: profile.id,
          },
        },
      },
      include: {
        groups: true,
      },
    });
    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server Error' });
  }
};

export const updateGroup = async (
  req: AuthenticatedRequest<ParamsWithGroupId, Partial<BodyCreateGroup>, any>,
  res: Response,
) => {
  try {
    const profileId = req.user?.profileId!;
    const groupId = req.params.groupId;
    const { groupName } = req.body;
    let { groupType } = req.body;

    if (groupType) {
      groupType = groupType.toUpperCase() as GroupType;
      if (!Object.keys(GroupType).includes(groupType)) {
        return res.status(400).json({ message: 'Invalid room type' });
      }
    }

    const [profile, group] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      await db.group.findUnique({
        where: {
          id: groupId,
        },
        include: { messages: true },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!group) {
      return res.status(400).json({ message: 'Group not found' });
    }

    const room = await db.room.findUnique({
      where: {
        id: group?.roomId,
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
    if (!room) {
      return res.status(400).json({ message: 'You are not admin or moderator of this room' });
    }

    const updatedRoom = await db.room.update({
      where: {
        id: group?.roomId,
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
        groups: {
          update: {
            where: {
              id: group.id,
            },
            data: {
              name: groupName,
              type: groupType,
            },
          },
        },
      },
      include: {
        groups: true,
      },
    });
    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a group
export const deleteGroup = async (
  req: AuthenticatedRequest<ParamsWithGroupId, any, any>,
  res: Response,
) => {
  try {
    const groupId = req.params.groupId;
    const profileId = req.user?.profileId;

    const [profile, group] = await Promise.all([
      db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),
      await db.group.findUnique({
        where: {
          id: groupId,
        },
        include: { messages: true },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!group) {
      return res.status(400).json({ message: 'Group not found' });
    }

    if (group.name === 'default') {
      return res.status(400).json({ message: 'You can not delete general group' });
    }

    const room = await db.room.findUnique({
      where: {
        id: group?.roomId,
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
    if (!room) {
      return res.status(400).json({ message: 'You are not admin or moderator of this room' });
    }
    const updatedRoom = await db.room.update({
      where: {
        id: group?.roomId,
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
        groups: {
          delete: {
            id: group.id,
          },
        },
      },
    });

    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

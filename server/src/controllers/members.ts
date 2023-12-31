import { Response } from 'express';
import { db } from '@/prisma/db';
import { GroupType, MemberRole } from '@prisma/client';
import { AuthenticatedRequest } from '@/lib/types';
import { isTruthy } from '@/lib/utils';
import { createMsg } from '@/lib/utils';


type QueryInclude = {
  profile: string;
};

type QueryFilter = {
  roomId: string;
};

export const getMembers = async (
  req: AuthenticatedRequest<any, any, Partial<QueryInclude> & QueryFilter>,
  res: Response,
) => {
  try {
    const { profile, roomId } = req.query;
    if (!roomId) {
      return res.status(404).json({ message: 'Require room id' });
    }

    const members = await db.member.findMany({
      where: {
        roomId,
      },
      include: { profile: isTruthy(profile) },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

type ParamsWithMemberId = {
  memberId: string;
};

// Get a specific group by groupId
// export const getMemberByMemberId = async (
//   req: AuthenticatedRequest<ParamsWithGroupId, any, Partial<QueryInclude>>,
//   res: Response,
// ) => {
//   try {
//     const groupId = req.params.groupId;
//     const { messages, profile } = req.query;
//     const group = await db.group.findUnique({
//       where: { id: groupId },
//       include: { messages: isTruthy(messages), profile: isTruthy(profile) },
//     });

//     if (!group) {
//       return res.status(404).json({ message: 'Group not found' });
//     }
//     return res.status(200).json(group);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal room Error' });
//   }
// };

type BodyUpdateMember = {
  role: MemberRole;
};

// create new group
// export const createMember = async (
//   req: AuthenticatedRequest<any, Partial<BodyCreateGroup>, any>,
//   res: Response,
// ) => {
//   try {
//     const { groupName, roomId, groupType = 'TEXT' } = req.body;
//     const profileId = req.user?.profileId!;

//     if (!groupName || !roomId) {
//       return res.status(400).json({ message: 'Need group name, room id' });
//     }
//     if (groupName === 'default') {
//       return res.status(400).json({ message: 'Name can not be general' });
//     }

//     const [profile, room] = await Promise.all([
//       await db.profile.findUnique({
//         where: { id: profileId },
//         select: { id: true },
//       }),
//       await db.room.findUnique({
//         where: {
//           id: roomId,
//           members: {
//             some: {
//               profileId,
//               role: {
//                 in: [MemberRole.ADMIN, MemberRole.MODERATOR],
//               },
//             },
//           },
//         },
//       }),
//     ]);

//     if (!profile) {
//       return res.status(400).json({ message: 'Profile not found' });
//     }
//     if (!room) {
//       return res.status(400).json({
//         message:
//           'Can not create group. Room not exist or you are not admin or moderator of this room',
//       });
//     }

//     const isExistingGroup = await db.group.findFirst({
//       where: {
//         roomId: room.id,
//         name: groupName,
//       },
//     });
//     if (isExistingGroup) {
//       return res.status(400).json({ message: 'Group with same name already exists in this room' });
//     }

//     const updatedRoom = await db.room.update({
//       where: {
//         id: room.id,
//       },
//       data: {
//         groups: {
//           create: {
//             name: groupName,
//             type: groupType,
//             profileId: profile.id,
//           },
//         },
//       },
//       include: {
//         groups: true,
//       },
//     });
//     return res.status(200).json(updatedRoom);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal room Error' });
//   }
// };

export const updateMember = async (
  req: AuthenticatedRequest<ParamsWithMemberId, BodyUpdateMember, QueryFilter>,
  res: Response,
) => {
  try {
    const profileId = req.user?.profileId!;
    const { roomId } = req.query;
    const memberId = req.params.memberId;
    const { role } = req.body;

    if (!role || !memberId || !roomId) {
      return res.status(404).json({ message: 'Require room id, role, member id' });
    }

    const updatedRoom = await db.room.update({
      where: {
        id: roomId,
        profileId,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profileId,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

// Delete a member
export const deleteMember = async (
  req: AuthenticatedRequest<ParamsWithMemberId, any, QueryFilter>,
  res: Response,
) => {
  try {
    const profileId = req.user?.profileId!;
    const { roomId } = req.query;
    const memberId = req.params.memberId;

    if (!memberId || !roomId) {
      return res.status(404).json({ message: 'Require room id, member id' });
    }

    const updatedRoom = await db.room.update({
      where: {
        id: roomId,
        profileId,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profileId,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

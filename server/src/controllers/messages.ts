import { Response } from 'express';
import { db } from '@/prisma/db';
import { GroupType, MemberRole, RoomType } from '@prisma/client';
import { AuthenticatedRequest } from '@/lib/types';
import { isTruthy } from '@/lib/utils';

type BodyCreateMessage = {
  groupId: string;
  content: string;
};

type BodyEditMessage = {
  content: string;
};

type ParamsWithMessageId = {
  messageId: string;
};

// Get message by messageId
export const getMessageById = async (
  req: AuthenticatedRequest<ParamsWithMessageId, any, any>,
  res: Response,
) => {
  try {
    const messageId = req.params.messageId;

    const message = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return res.status(400).json({ message: 'Message not found' });
    }

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// create new message in channel
export const createMessage = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateMessage>, any>,
  res: Response,
) => {
  try {
    const { groupId, content = 'TEXT' } = req.body;
    const profileId = req.user?.profileId!;

    if (!groupId) {
      return res.status(400).json({ message: 'GroupId missing' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Blank message not allowed' });
    }

    const [profile, group] = await Promise.all([
      await db.profile.findUnique({
        where: { id: profileId },
        select: { id: true },
      }),

      await db.group.findUnique({
        where: {
          id: groupId,
        },
      }),
    ]);
    if (!profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }
    if (!group) {
      return res.status(400).json({
        message: 'Group not exist',
      });
    }
    const curMember = db.member.findFirstOrThrow({
      where: {
        profileId: profileId,
        roomId: group?.roomId,
      },
    });

    if (!curMember) {
      return res
        .status(400)
        .json({ message: 'Can not create message. You are not member of this channel' });
    }

    const newMessage = db.message.create({
      data: { content: content, memberId: (await curMember).id, groupId: groupId, deleted: false },
    });
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server Error' });
  }
};

// Delete message by messageId
export const deleteMessage = async (
  req: AuthenticatedRequest<ParamsWithMessageId, any, any>,
  res: Response,
) => {
  try {
    const messageId = req.params.messageId;
    const profileId = req.user?.profileId!;

    const message = await db.message.findUnique({
      where: { id: messageId },
    });
    if (!message) {
      return res.status(400).json({ message: 'Message not found' });
    }

    const member = await db.member.findUnique({
      where: { id: message.memberId },
    });
    // Only author can delete his message
    if (member?.profileId !== profileId) {
      return res.status(403).json({ message: 'Only author can delete message' });
    }

    await db.message.delete({
      where: {
        id: messageId,
      },
    });

    return res.status(200).send({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Edit message by messageId
export const editMessage = async (
  req: AuthenticatedRequest<ParamsWithMessageId, BodyEditMessage, any>,
  res: Response,
) => {
  try {
    const messageId = req.params.messageId;
    const content = req.body.content;
    const profileId = req.user?.profileId!;

    const message = await db.message.findUnique({
      where: { id: messageId },
    });
    if (!message) {
      return res.status(400).json({ message: 'Message not found' });
    }

    const member = await db.member.findUnique({
      where: { id: message.memberId },
    });
    // Only author can edit his message
    if (member?.profileId !== profileId) {
      return res.status(403).json({ message: 'Only author can edit message' });
    }

    const editedMessage = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        content: content,
      },
    });

    return res.status(200).send({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

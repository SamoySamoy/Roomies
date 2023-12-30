import { Response } from 'express';
import { db } from '@/prisma/db';
import { AuthenticatedRequest } from '@/lib/types';
import { createMsg } from '@/lib/utils';

const MESSAGES_BATCH = 10;

type QueryFilter = {
  cursor: string;
  groupId: string;
};

type BodyCreateMessage = {
  groupId: string;
  roomId: string;
  content: string;
  fileUrl: string;
};

type BodyEditMessage = {
  content: string;
};

type ParamsWithMessageId = {
  messageId: string;
};

export const getMessages = async (
  req: AuthenticatedRequest<any, any, Partial<QueryFilter>>,
  res: Response,
) => {
  try {
    const { cursor, groupId } = req.query;
    if (!groupId) {
      return res.status(400).json({ message: 'Require cursor and group id' });
    }
    const messages = await db.message.findMany({
      where: {
        groupId,
      },
      take: MESSAGES_BATCH,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let lastCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      lastCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return res.status(200).json({
      messages,
      lastCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
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
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message) {
      return res.status(400).json({ message: 'Message not found' });
    }

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

// create new message in channel
export const createMessage = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateMessage>, any>,
  res: Response,
) => {
  try {
    const { groupId, roomId, content, fileUrl } = req.body;
    const profileId = req.user?.profileId!;

    if (!groupId || !roomId || !content) {
      return res.status(400).json({ message: 'Require group id, room id, content, missing' });
    }

    const [group, member] = await Promise.all([
      db.group.findFirst({
        where: {
          id: groupId,
          roomId,
        },
      }),
      db.member.findFirst({
        where: {
          profileId,
          roomId,
        },
      }),
    ]);
    if (!group) {
      return res.status(400).json({ message: 'Group not exist' });
    }
    if (!member) {
      return res
        .status(400)
        .json({ message: 'Can not create message. You are not member of this channel' });
    }

    const newMessage = db.message.create({
      data: { content, fileUrl, memberId: member.id, groupId: groupId },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

// Edit message by messageId
export const editMessage = async (
  req: AuthenticatedRequest<ParamsWithMessageId, BodyEditMessage, any>,
  res: Response,
) => {
  try {
    const messageId = req.params.messageId;
    const profileId = req.user?.profileId!;
    const { content } = req.body;

    const message = await db.message.findUnique({
      where: { id: messageId },
    });
    if (!message) {
      return res.status(400).json({ message: 'Message not found' });
    }

    const member = await db.member.findUnique({
      where: { id: message.memberId },
    });
    if (member?.profileId !== profileId) {
      return res.status(403).json({ message: 'Only the author can edit his message' });
    }

    const editedMessage = await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        content,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(200).json(editedMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
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

    if (member?.profileId !== profileId) {
      return res.status(403).json({ message: 'Only the author can delete his message' });
    }

    await db.message.update({
      where: {
        id: messageId,
      },
      data: {
        fileUrl: null,
        content: 'This message has been deleted.',
        deleted: true,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(200).send({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

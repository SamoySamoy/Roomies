import path from 'path';
import fsPromises from 'fs/promises';

import { Response } from 'express';
import { db } from '@/prisma/db';
import { AuthenticatedRequest } from '@/lib/types';
import {
  createMsg,
  getExtName,
  getFileName,
  isImageFile,
  mkdirIfNotExist,
  uuid,
} from '@/lib/utils';
import sharp from 'sharp';
import { MESSAGES_BATCH } from '@/lib/constants';

type QueryFilter = {
  cursor: string;
  groupId: string;
};

type BodyCreateMessage = {
  groupId: string;
  roomId: string;
  content: string;
};

type BodyUpdateMessage = {
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require cursor and group id',
        }),
      );
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Message not found',
        }),
      );
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
    const { groupId, roomId, content } = req.body;
    const profileId = req.user?.profileId!;

    if (!groupId || !roomId || !content) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require group id, room id, content, missing',
        }),
      );
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Group not exist',
        }),
      );
    }
    if (!member) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Can not create message. You are not member of this channel',
        }),
      );
    }

    const newMessage = db.message.create({
      data: { content, fileUrl: null, memberId: member.id, groupId: groupId },
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
// create new message in channel
export const uploadFile = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateMessage>, any>,
  res: Response,
) => {
  try {
    const { groupId, roomId } = req.body;
    const profileId = req.user?.profileId!;

    if (!groupId || !roomId) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require group id, room id, missing',
        }),
      );
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Group not exist',
        }),
      );
    }
    if (!member) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Can not create message. You are not member of this channel',
        }),
      );
    }

    const file = req.file!;
    const relFolderPath = `/public/groups/${groupId}`;
    const absFolderPath = path.join(__dirname, '..', '..', relFolderPath);

    let filename = file.filename;
    if (isImageFile(filename)) {
      filename = `${getFileName(filename)}_${uuid()}.webp`;
    } else {
      filename = `${getFileName(filename)}_${uuid()}.${getExtName(filename)}`;
    }
    const relFilePath = path.join(relFolderPath, filename);
    const absFilePath = path.join(absFolderPath, filename);

    await mkdirIfNotExist(absFolderPath);
    if (isImageFile(filename)) {
      await sharp(file.buffer).resize(350, 200).webp().toFile(absFilePath);
    } else {
      await fsPromises.writeFile(absFilePath, file.buffer);
    }

    const newMessage = db.message.create({
      data: {
        content: 'This message is a file',
        fileUrl: relFilePath,
        memberId: member.id,
        groupId: group.id,
      },
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

// Update message by messageId
export const updateMessage = async (
  req: AuthenticatedRequest<ParamsWithMessageId, BodyUpdateMessage, any>,
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Message not found',
        }),
      );
    }

    const member = await db.member.findUnique({
      where: { id: message.memberId },
    });

    if (member?.profileId !== profileId) {
      return res.status(403).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Only the author can edit his / her message',
        }),
      );
    }

    const updateedMessage = await db.message.update({
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

    return res.status(200).json(updateedMessage);
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
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Message not found',
        }),
      );
    }

    const member = await db.member.findUnique({
      where: { id: message.memberId },
    });
    if (member?.profileId !== profileId) {
      return res.status(403).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Only the author can delete his / her message',
        }),
      );
    }

    const deletedMessage = await db.message.update({
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

    return res.status(200).send(deletedMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

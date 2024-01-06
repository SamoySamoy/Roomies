import path from 'path';
import fsPromises from 'fs/promises';

import { Response } from 'express';
import { db } from '@/prisma/db';
import { AuthenticatedRequest } from '@/lib/types';
import {
  createMsg,
  createResult,
  getExtName,
  getFileName,
  isImageFile,
  mkdirIfNotExist,
  uuid,
} from '@/lib/utils';
import sharp from 'sharp';
import { MESSAGES_BATCH, MESSAGE_FILE_HEIGHT, MESSAGE_FILE_WIDTH } from '@/lib/constants';
import { Member } from '@prisma/client';

type QueryFilter = {
  cursor: string;
  conversationId: string;
};

type BodyCreateDirectMessage = {
  conversationId: string;
  roomId: string;
  content: string;
};

type BodyUpdateDirectMessage = {
  content: string;
};

type ParamsWithDirectMessageId = {
  directMessageId: string;
};

export const getDirectMessages = async (
  req: AuthenticatedRequest<any, any, Partial<QueryFilter>>,
  res: Response,
) => {
  try {
    const { cursor, conversationId } = req.query;
    if (!conversationId) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require cursor and conversation id',
        }),
      );
    }
    const directMessages = await db.directMessage.findMany({
      where: {
        conversationId,
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
    if (directMessages.length === MESSAGES_BATCH) {
      lastCursor = directMessages[MESSAGES_BATCH - 1].id;
    }

    return res.status(200).json(
      createResult({
        type: 'paging:cursor',
        items: directMessages,
        lastCursor,
      }),
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const getDirectMessageByDirectMessageId = async (
  req: AuthenticatedRequest<ParamsWithDirectMessageId, any, any>,
  res: Response,
) => {
  try {
    const directMessageId = req.params.directMessageId;

    const directMessage = await db.directMessage.findUnique({
      where: { id: directMessageId },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Direct Message not found',
        }),
      );
    }

    return res.status(200).json(directMessage);
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
export const createDirectMessage = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateDirectMessage>, any>,
  res: Response,
) => {
  try {
    const { conversationId, roomId, content } = req.body;
    const profileId = req.user?.profileId!;

    if (!conversationId || !roomId || !content) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require conversation id, room id, content, missing',
        }),
      );
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId,
            },
          },
          {
            memberTwo: {
              profileId,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!conversation) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Conversation not exist',
        }),
      );
    }
    let currentMember: Member | undefined;
    if (conversation.memberOne.profileId === profileId) {
      currentMember = conversation.memberOne;
    }
    if (conversation.memberTwo.profileId === profileId) {
      currentMember = conversation.memberTwo;
    }
    if (!currentMember) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Can not create message. You are not member of this conversation',
        }),
      );
    }

    const newDirectMessage = db.directMessage.create({
      data: { content, fileUrl: null, memberId: currentMember.id, conversationId },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(200).json(newDirectMessage);
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
export const uploadDirectMessageFile = async (
  req: AuthenticatedRequest<any, Partial<BodyCreateDirectMessage>, any>,
  res: Response,
) => {
  try {
    const { conversationId, roomId } = req.body;
    const profileId = req.user?.profileId!;

    if (!conversationId || !roomId) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Require conversation id, room id, missing',
        }),
      );
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              profileId,
            },
          },
          {
            memberTwo: {
              profileId,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!conversation) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Conversation not exist',
        }),
      );
    }
    let currentMember: Member | undefined;
    if (conversation.memberOne.profileId === profileId) {
      currentMember = conversation.memberOne;
    }
    if (conversation.memberTwo.profileId === profileId) {
      currentMember = conversation.memberTwo;
    }
    if (!currentMember) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Can not create message. You are not member of this conversation',
        }),
      );
    }

    const file = req.file!;
    const relFolderPath = `/public/conversations/${conversationId}`;
    const absFolderPath = path.join(__dirname, '..', '..', relFolderPath);

    let filename = file.originalname;
    if (isImageFile(filename)) {
      filename = `${getFileName(filename)}_${uuid()}.webp`;
    } else {
      filename = `${getFileName(filename)}_${uuid()}.${getExtName(filename)}`;
    }
    const relFilePath = path.join(relFolderPath, filename);
    const absFilePath = path.join(absFolderPath, filename);

    await mkdirIfNotExist(absFolderPath);
    if (isImageFile(filename)) {
      await sharp(file.buffer)
        .resize(MESSAGE_FILE_WIDTH, MESSAGE_FILE_HEIGHT)
        .webp()
        .toFile(absFilePath);
    } else {
      await fsPromises.writeFile(absFilePath, file.buffer);
    }

    const newDirectMessage = db.directMessage.create({
      data: {
        content: 'This message is a file',
        fileUrl: relFilePath,
        memberId: currentMember.id,
        conversationId,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    return res.status(200).json(newDirectMessage);
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
export const updateDirectMessage = async (
  req: AuthenticatedRequest<ParamsWithDirectMessageId, BodyUpdateDirectMessage, any>,
  res: Response,
) => {
  try {
    const directMessageId = req.params.directMessageId;
    const profileId = req.user?.profileId!;
    const { content } = req.body;

    const directMessage = await db.directMessage.findUnique({
      where: { id: directMessageId },
    });
    if (!directMessage) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Direct message not found',
        }),
      );
    }

    const owner = await db.member.findUnique({
      where: { id: directMessage.memberId },
    });
    if (!owner) {
      return res.status(404).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'The owner of this direct message was not found',
        }),
      );
    }
    if (owner.profileId !== profileId) {
      return res.status(403).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Only the author can edit his / her direct message',
        }),
      );
    }

    const updatedDirectMessage = await db.directMessage.update({
      where: {
        id: directMessageId,
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

    return res.status(200).json(updatedDirectMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

export const deleteDirectMessage = async (
  req: AuthenticatedRequest<ParamsWithDirectMessageId, any, any>,
  res: Response,
) => {
  try {
    const directMessageId = req.params.directMessageId;
    const profileId = req.user?.profileId!;

    const directMessage = await db.directMessage.findUnique({
      where: { id: directMessageId },
    });
    if (!directMessage) {
      return res.status(400).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Message not found',
        }),
      );
    }

    const owner = await db.member.findUnique({
      where: { id: directMessage.memberId },
    });
    if (!owner) {
      return res.status(404).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'The owner of this direct message was not found',
        }),
      );
    }
    if (owner.profileId !== profileId) {
      return res.status(403).json(
        createMsg({
          type: 'invalid',
          invalidMessage: 'Only the author can edit his / her direct message',
        }),
      );
    }

    const deletedDirectMessage = await db.directMessage.update({
      where: {
        id: directMessageId,
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

    return res.status(200).send(deletedDirectMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      createMsg({
        type: 'error',
      }),
    );
  }
};

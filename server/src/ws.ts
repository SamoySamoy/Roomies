import path from 'path';
import fsPromises from 'fs/promises';
import sharp from 'sharp';
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { db } from './prisma/db';
import { Message } from '@prisma/client';
import { corsOptions } from './lib/config';
import { IMAGE_SIZE_LIMIT_IN_MB } from './lib/constants';
import { ValidationError } from './lib/types';
import {
  convertMbToBytes,
  getExtName,
  getFileName,
  isImageFile,
  mkdirIfNotExist,
  uuid,
} from './lib/utils';

export type ServerToClientEvents = {
  'server:group:join:success': (msg: string) => void;
  'server:group:join:error': (msg: string) => void;
  'server:group:leave:success': (msg: string) => void;
  'server:group:leave:error': (msg: string) => void;
  'server:group:typing:success': (msg: string) => void;
  'server:group:typing:error': (msg: string) => void;
  'server:group:message:post:success': (message: Message) => void;
  'server:group:message:post:error': (msg: string) => void;
  'server:group:message:upload:success': (message: Message) => void;
  'server:group:message:upload:error': (msg: string) => void;
  'server:group:message:update:success': (messages: Message) => void;
  'server:group:message:update:error': (msg: string) => void;
  'server:group:message:delete:success': (messages: Message) => void;
  'server:group:message:delete:error': (msg: string) => void;
};

export type Origin = {
  roomId: string;
  profileId: string;
};
export type GroupOrigin = Origin & {
  groupId: string;
};
export type ConversationOrigin = Origin & {
  memberId: string;
};

export type MessageIdentity = { email: string };
export type MessageCreate = { content: string };
export type MessageUpload = {
  filename: string;
  filesize: number;
  filetype: string;
  buffer: Buffer | ArrayBuffer | ReadableStream<Uint8Array> | Blob;
};

export type MessageUpdate = { messageId: string; content: string };
export type MessageDelete = { messageId: string };

export type ClientToServerEvents = {
  'client:group:join': (origin: GroupOrigin, arg: MessageIdentity) => void;
  'client:group:leave': (origin: GroupOrigin, arg: MessageIdentity) => void;
  'client:group:typing': (origin: GroupOrigin, arg: MessageIdentity) => void;
  'client:group:message:post': (origin: GroupOrigin, arg: MessageCreate) => void;
  'client:group:message:upload': (origin: GroupOrigin, file: MessageUpload) => void;
  'client:group:message:update': (origin: GroupOrigin, arg: MessageUpdate) => void;
  'client:group:message:delete': (origin: GroupOrigin, arg: MessageDelete) => void;
};

export function setupWs(httpServer: HTTPServer) {
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    path: '/api/socket',
    serveClient: false,
    addTrailingSlash: false,
    cors: corsOptions,
    maxHttpBufferSize: convertMbToBytes(IMAGE_SIZE_LIMIT_IN_MB),
  });

  io.on('connection', socket => {
    // On user join group
    socket.on('client:group:join', async (origin, arg) => {
      socket.join(origin.groupId);

      try {
        // On user join group - to user only
        socket.emit('server:group:join:success', `You just join group ${origin.groupId}`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:group:join:error', `${error.message}`);
        } else {
          socket.emit('server:group:join:error', `Unexpected error. Something went wrong`);
        }
      }

      // On user join group - to other user in group
      try {
        socket.broadcast
          .to(origin.groupId)
          .emit('server:group:join:success', `${arg.email} just join group`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:group:join:error', `${error.message}`);
        } else {
          socket.emit('server:group:join:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user leave group
    socket.on('client:group:leave', async (origin, arg) => {
      socket.leave(origin.groupId);

      try {
        io.to(origin.groupId).emit('server:group:leave:success', `${arg.email} just leave group`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:group:leave:error', `${error.message}`);
        } else {
          socket.emit('server:group:leave:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user typing
    socket.on('client:group:typing', async (origin, arg) => {
      try {
        socket.broadcast
          .to(origin.groupId)
          .emit('server:group:typing:success', `${arg.email} is typing ...`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:group:typing:error', `${error.message}`);
        } else {
          socket.emit('server:group:typing:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user create new message
    socket.on('client:group:message:post', async (origin, arg) => {
      try {
        const newMessage = await createMessage(origin, arg);
        io.to(origin.groupId).emit('server:group:message:post:success', newMessage);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:group:message:post:error', `${error.message}`);
        } else {
          socket.emit('server:group:message:post:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user upload a file
    socket.on('client:group:message:upload', async (origin, arg) => {
      try {
        const newMessage = await uploadFile(origin, arg);
        io.to(origin.groupId).emit('server:group:message:upload:success', newMessage);
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:group:message:upload:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit(
            'server:group:message:upload:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });

    // On user update message
    socket.on('client:group:message:update', async (origin, arg) => {
      try {
        const updatedMessage = await updateMessage(origin, arg);
        io.to(origin.groupId).emit('server:group:message:update:success', updatedMessage);
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:group:message:update:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit(
            'server:group:message:update:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });

    // On user delete message
    socket.on('client:group:message:delete', async (origin, arg) => {
      try {
        const deletedMessage = await deleteMesage(origin, arg);
        io.to(origin.groupId).emit('server:group:message:delete:success', deletedMessage);
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:group:message:delete:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit(
            'server:group:message:delete:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });
  });

  // Handle errors on the socket IO instance
  io.on('error', error => {
    console.error('Socket.IO error:', error);
    // maybe more
  });

  return io;
}

const createMessage = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:post']>
) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.groupId || !origin.roomId) {
    throw new ValidationError('Require profile id, group id and room id');
  }
  if (!arg.content) {
    throw new ValidationError('Require message content');
  }

  const [group, member] = await Promise.all([
    db.group.findFirst({
      where: {
        id: origin.groupId,
        roomId: origin.roomId,
      },
    }),
    db.member.findFirst({
      where: {
        profileId: origin.profileId,
        roomId: origin.roomId,
      },
    }),
  ]);
  if (!group) {
    throw new ValidationError(`Group ${origin.groupId} not exist`);
  }
  if (!member) {
    throw new ValidationError(`Can not create message. You are not member of this channel`);
  }

  const newMessage = await db.message.create({
    data: {
      content: arg.content,
      fileUrl: null,
      groupId: origin.groupId,
      memberId: member.id,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });
  return newMessage;
};

const uploadFile = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:upload']>
) => {
  const [origin, file] = args;
  if (!origin.profileId || !origin.groupId || !origin.roomId) {
    throw new ValidationError('Require profile id, group id and room id');
  }

  if (file.filesize > convertMbToBytes(IMAGE_SIZE_LIMIT_IN_MB)) {
    throw new ValidationError('File size not over 5 MB');
  }

  const [group, member] = await Promise.all([
    db.group.findFirst({
      where: {
        id: origin.groupId,
        roomId: origin.roomId,
      },
    }),
    db.member.findFirst({
      where: {
        profileId: origin.profileId,
        roomId: origin.roomId,
      },
    }),
  ]);
  if (!group) {
    throw new ValidationError(`Group ${origin.groupId} not exist`);
  }
  if (!member) {
    throw new ValidationError(`Can not create message. You are not member of this channel`);
  }

  const relFolderPath = `/public/groups/${origin.groupId}`;
  const absFolderPath = path.join(__dirname, '..', relFolderPath);
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
    await sharp(file.buffer as Buffer)
      .resize(350, 200)
      .webp()
      .toFile(absFilePath);
  } else {
    await fsPromises.writeFile(absFilePath, file.buffer as Buffer);
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
  return newMessage;
};

const updateMessage = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:update']>
) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.groupId || !origin.roomId) {
    throw new ValidationError('Require profile id, group id and room id');
  }
  if (!arg.content || !arg.messageId) {
    throw new ValidationError('Require message id and message content');
  }

  const message = await db.message.findUnique({
    where: { id: arg.messageId },
  });
  if (!message) {
    throw new ValidationError(`Message ${arg.messageId} not found`);
  }

  const owner = await db.member.findUnique({
    where: { id: message.memberId },
  });
  if (!owner) {
    throw new ValidationError('The owner of this message was not found');
  }
  if (owner.profileId !== origin.profileId) {
    throw new ValidationError('Only the author can edit his / her message');
  }

  const updatedMessage = await db.message.update({
    where: {
      id: arg.messageId,
    },
    data: {
      content: arg.content,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });
  return updatedMessage;
};

const deleteMesage = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:delete']>
) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.groupId || !origin.roomId) {
    throw new ValidationError('Require profile id, group id and room id');
  }
  if (!arg.messageId) {
    throw new ValidationError('Require message id');
  }

  const message = await db.message.findUnique({
    where: { id: arg.messageId },
  });
  if (!message) {
    throw new ValidationError(`Message ${arg.messageId} not found`);
  }

  const owner = await db.member.findUnique({
    where: { id: message.memberId },
  });
  if (!owner) {
    throw new ValidationError('The owner of this message was not found');
  }
  if (owner.profileId !== origin.profileId) {
    throw new ValidationError('Only the author can delete his / her message');
  }

  const deletedMessage = await db.message.update({
    where: {
      id: arg.messageId,
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
  return deletedMessage;
};

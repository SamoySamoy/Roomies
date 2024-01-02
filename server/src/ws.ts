import path from 'path';
import fsPromises from 'fs/promises';
import sharp from 'sharp';
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { db } from './prisma/db';
import { Group, MemberRole, Message } from '@prisma/client';
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
  'server:room:join:success': (msg: string) => void;
  'server:room:join:error': (msg: string) => void;
  'server:room:leave:success': (msg: string) => void;
  'server:room:leave:error': (msg: string) => void;
  'server:room:kick:success': (content: RoomKick) => void;
  'server:room:kick:error': (msg: string) => void;
  'server:room:role:success': (content: RoomRole) => void;
  'server:room:role:error': (msg: string) => void;

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

  'server:peer:init:success': (id: string) => void;
  'server:user-disconnected': (id: string) => void;
};

export type RoomOrigin = {
  roomId: string;
  profileId: string;
};
export type GroupOrigin = RoomOrigin & {
  groupId: string;
};
export type ConversationOrigin = RoomOrigin & {
  memberId: string;
};

export type RoomKick = {
  memberId: string;
};
export type RoomRole = {
  memberId: string;
  role: MemberRole;
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
  'client:room:join': (origin: RoomOrigin, arg: MessageIdentity) => void;
  'client:room:leave': (origin: RoomOrigin, arg: MessageIdentity) => void;
  'client:room:kick': (origin: RoomOrigin, arg: RoomKick) => void;
  'client:room:role': (origin: RoomOrigin, arg: RoomRole) => void;

  'client:group:join': (origin: GroupOrigin, arg: MessageIdentity) => void;
  'client:group:leave': (origin: GroupOrigin, arg: MessageIdentity) => void;
  'client:group:typing': (origin: GroupOrigin, arg: MessageIdentity) => void;
  'client:group:message:post': (origin: GroupOrigin, arg: MessageCreate) => void;
  'client:group:message:upload': (origin: GroupOrigin, file: MessageUpload) => void;
  'client:group:message:update': (origin: GroupOrigin, arg: MessageUpdate) => void;
  'client:group:message:delete': (origin: GroupOrigin, arg: MessageDelete) => void;

  'client:peer:init:success': (origin: GroupOrigin) => void;
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
    // On user join room
    socket.on('client:room:join', async (origin, arg) => {
      socket.join(origin.roomId);

      console.log(arg.email, 'join room', origin.roomId);

      try {
        // On user join room - to user only
        socket.emit('server:room:join:success', `You just join room ${origin.roomId}`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:room:join:error', `${error.message}`);
        } else {
          socket.emit('server:room:join:error', `Unexpected error. Something went wrong`);
        }
      }

      // On user join room - to other user in room
      try {
        socket.broadcast
          .to(origin.roomId)
          .emit('server:room:join:success', `${arg.email} just join room ${origin.profileId}`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:room:join:error', `${error.message}`);
        } else {
          socket.emit('server:room:join:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user leave room
    socket.on('client:room:leave', async (origin, arg) => {
      socket.leave(origin.roomId);

      console.log(arg.email, 'leave room', origin.roomId);

      try {
        io.to(origin.roomId).emit('server:room:leave:success', `${arg.email} ${origin.profileId} just leave room`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:room:leave:error', `${error.message}`);
        } else {
          socket.emit('server:room:leave:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user kick member
    socket.on('client:room:kick', async (origin, arg) => {
      try {
        await kickMember(origin, arg);
        // On user kick member - to the one whom have been kicked
        socket.broadcast.to(origin.roomId).emit('server:room:kick:success', arg);

        // To admin
        socket.emit('server:room:kick:success', arg);
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:room:kick:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit('server:room:kick:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user change role member
    socket.on('client:room:role', async (origin, arg) => {
      try {
        await changeRoleMember(origin, arg);
        // On user kick member - to the one whom have been kicked
        socket.broadcast.to(origin.roomId).emit('server:room:role:success', arg);

        // To admin
        socket.emit('server:room:role:success', arg);
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:room:role:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit('server:room:role:error', `Unexpected error. Something went wrong`);
        }
      }
    });

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
          .emit('server:group:join:success', `${arg.email} just join group ${origin.profileId}`);
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

    socket.on('client:peer:init:success', function (origin) {
      console.log(origin.profileId + 'join the audio: ' + origin.groupId);
      try {
        socket.join(origin.groupId);
        socket.broadcast.to(origin.groupId).emit('server:peer:init:success', origin.profileId);
        console.log('broad cast to the room');
      } catch (err: any) {
        console.log(err);
      }
      socket.on('disconnect', function () {
        console.log('user disconnected: ' + origin.profileId);
        socket.broadcast.to(origin.groupId).emit('server:user-disconnected', origin.profileId);
      });
    });
  });

  // Handle errors on the socket IO instance
  io.on('error', error => {
    console.error('Socket.IO error:', error);
    // maybe more
  });

  return io;
}

const kickMember = async (...args: Parameters<ClientToServerEvents['client:room:kick']>) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.roomId) {
    throw new ValidationError('Require profile id and room id');
  }
  if (!arg.memberId) {
    throw new ValidationError('Require member id');
  }

  const profile = await db.profile.findUnique({
    where: { id: origin.profileId },
  });
  if (!profile) {
    throw new ValidationError('Profile not found');
  }

  const room = await db.room.findUnique({
    where: {
      id: origin.roomId,
      members: {
        some: {
          profileId: origin.profileId,
          role: MemberRole.ADMIN,
        },
      },
    },
  });
  if (!room) {
    throw new ValidationError('Only admin can kick other members');
  }

  const updatedRoom = await db.room.update({
    where: {
      id: origin.roomId,
      profileId: origin.profileId,
    },
    data: {
      members: {
        deleteMany: {
          id: arg.memberId,
          profileId: {
            not: origin.profileId,
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

  return updatedRoom;
};

const changeRoleMember = async (...args: Parameters<ClientToServerEvents['client:room:role']>) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.roomId) {
    throw new ValidationError('Require profile id and room id');
  }
  if (!arg.memberId || !arg.role) {
    throw new ValidationError('Require member id and role');
  }

  const profile = await db.profile.findUnique({
    where: { id: origin.profileId },
  });
  if (!profile) {
    throw new ValidationError('Profile not found');
  }

  const room = await db.room.findUnique({
    where: {
      id: origin.roomId,
      members: {
        some: {
          profileId: origin.profileId,
          role: MemberRole.ADMIN,
        },
      },
    },
  });
  if (!room) {
    throw new ValidationError('Only admin can change role of other members');
  }

  const updatedRoom = await db.room.update({
    where: {
      id: origin.roomId,
      profileId: origin.profileId,
    },
    data: {
      members: {
        update: {
          where: {
            id: arg.memberId,
            profileId: {
              not: origin.profileId,
            },
          },
          data: {
            role: arg.role,
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
  return updatedRoom;
};

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

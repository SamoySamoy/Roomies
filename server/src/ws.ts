import path from 'path';
import fsPromises from 'fs/promises';
import sharp from 'sharp';
import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { db } from './prisma/db';
import { DirectMessage, Message, MemberRole, Member } from '@prisma/client';
import { corsOptions } from '@/lib/config';
import { IMAGE_SIZE_LIMIT_IN_MB } from '@/lib/constants';
import { ValidationError } from '@/lib/types';
import {
  convertMbToBytes,
  getExtName,
  getFileName,
  isImageFile,
  mkdirIfNotExist,
  uuid,
} from '@/lib/utils';

type MeetingState = {
  profileId: string;
  email: string;
  imageUrl: string;
} & (
  | {
      type: 'camera';
      cameraOn: boolean;
      micOn: boolean;
    }
  | {
      type: 'screen';
    }
);

type MeetingStateIdentity = Pick<MeetingState, 'profileId' | 'type'>;

/* 
fakeRedis = {
  `groupdId`: {
    `profileId`: {...MeetingState}
  }
}
*/
const fakeRedis: Record<string, Record<string, MeetingState>> = {};
const getMeetingStates = (groupId: string) => {
  if (!fakeRedis[groupId]) return [];
  return Array.from(Object.values(fakeRedis[groupId]));
};
const createMeetingState = (groupId: string, newState: MeetingState) => {
  if (!fakeRedis[groupId]) {
    fakeRedis[groupId] = {};
  }
  fakeRedis[groupId][`${newState.profileId}`] = newState;
};
const updateMeetingState = (
  groupId: string,
  identity: MeetingStateIdentity,
  toggle: 'camera' | 'mic',
) => {
  if (!fakeRedis[groupId] || !fakeRedis[groupId][`${identity.profileId}`]) {
    return;
  }
  const oldState = fakeRedis[groupId][`${identity.profileId}`];
  if (oldState.type !== 'camera') {
    return;
  }

  let newState: MeetingState;
  switch (toggle) {
    case 'camera':
      newState = {
        ...oldState,
        cameraOn: !oldState.cameraOn,
      };
    case 'mic':
      newState = {
        ...oldState,
        micOn: !oldState.micOn,
      };
  }
  fakeRedis[groupId][`${identity.profileId}`] = newState;
};
const deleteMeetingState = (groupId: string, identity: MeetingStateIdentity) => {
  if (!fakeRedis[groupId] || !fakeRedis[groupId][`${identity.profileId}`]) {
    return;
  }
  delete fakeRedis[groupId][`${identity.profileId}`];

  if (Array.from(Object.keys(fakeRedis[groupId])).length === 0) {
    delete fakeRedis[groupId];
  }
};

export type RoomOrigin = {
  roomId: string;
  profileId: string;
};
export type GroupOrigin = RoomOrigin & {
  groupId: string;
};
export type ConversationOrigin = RoomOrigin & {
  conversationId: string;
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

  'server:conversation:join:success': (msg: string) => void;
  'server:conversation:join:error': (msg: string) => void;
  'server:conversation:leave:success': (msg: string) => void;
  'server:conversation:leave:error': (msg: string) => void;
  'server:conversation:typing:success': (msg: string) => void;
  'server:conversation:typing:error': (msg: string) => void;
  'server:conversation:message:post:success': (message: DirectMessage) => void;
  'server:conversation:message:post:error': (msg: string) => void;
  'server:conversation:message:upload:success': (message: DirectMessage) => void;
  'server:conversation:message:upload:error': (msg: string) => void;
  'server:conversation:message:update:success': (messages: DirectMessage) => void;
  'server:conversation:message:update:error': (msg: string) => void;
  'server:conversation:message:delete:success': (messages: DirectMessage) => void;
  'server:conversation:message:delete:error': (msg: string) => void;

  'server:meeting:join:success': (meetingStates: MeetingState[]) => void;
  'server:meeting:join:error': (msg: string) => void;
  'server:meeting:leave:success': (meetingStates: MeetingState[]) => void;
  'server:meeting:leave:error': (msg: string) => void;
  'server:meeting:camera:success': (meetingStates: MeetingState[]) => void;
  'server:meeting:camera:error': (msg: string) => void;
  'server:meeting:mic:success': (meetingStates: MeetingState[]) => void;
  'server:meeting:mic:error': (msg: string) => void;
  'server:meeting:screen:on:success': (meetingStates: MeetingState[]) => void;
  'server:meeting:screen:on:error': (msg: string) => void;
  'server:meeting:screen:off:success': (meetingStates: MeetingState[]) => void;
  'server:meeting:screen:off:error': (msg: string) => void;
  'server:meeting:state': (messtingStates: MeetingState[]) => void;
};

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

  'client:conversation:join': (origin: ConversationOrigin, arg: MessageIdentity) => void;
  'client:conversation:leave': (origin: ConversationOrigin, arg: MessageIdentity) => void;
  'client:conversation:typing': (origin: ConversationOrigin, arg: MessageIdentity) => void;
  'client:conversation:message:post': (origin: ConversationOrigin, arg: MessageCreate) => void;
  'client:conversation:message:upload': (origin: ConversationOrigin, file: MessageUpload) => void;
  'client:conversation:message:update': (origin: ConversationOrigin, arg: MessageUpdate) => void;
  'client:conversation:message:delete': (origin: ConversationOrigin, arg: MessageDelete) => void;

  'client:meeting:join': (origin: GroupOrigin, arg: MeetingState) => void;
  'client:meeting:leave': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
  'client:meeting:camera': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
  'client:meeting:mic': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
  'client:meeting:screen:on': (origin: GroupOrigin, arg: MeetingState) => void;
  'client:meeting:screen:off': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
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

      try {
        io.to(origin.roomId).emit(
          'server:room:leave:success',
          `${arg.email} ${origin.profileId} just leave room`,
        );
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
        const newMessage = await uploadMessageFile(origin, arg);
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

    // On user join conversation
    socket.on('client:conversation:join', async (origin, arg) => {
      socket.join(origin.conversationId);

      try {
        // On user join conversation - to user only
        socket.emit(
          'server:conversation:join:success',
          `You just join conversation ${origin.conversationId}`,
        );
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:join:error', `${error.message}`);
        } else {
          socket.emit('server:conversation:join:error', `Unexpected error. Something went wrong`);
        }
      }

      // On user join conversation - to other user in conversation
      try {
        socket.broadcast
          .to(origin.conversationId)
          .emit(
            'server:conversation:join:success',
            `${arg.email} just join conversation ${origin.profileId}`,
          );
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:join:error', `${error.message}`);
        } else {
          socket.emit('server:conversation:join:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user leave conversation
    socket.on('client:conversation:leave', async (origin, arg) => {
      socket.leave(origin.conversationId);

      try {
        io.to(origin.conversationId).emit(
          'server:conversation:leave:success',
          `${arg.email} just leave conversation`,
        );
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:leave:error', `${error.message}`);
        } else {
          socket.emit('server:conversation:leave:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user typing
    socket.on('client:conversation:typing', async (origin, arg) => {
      try {
        socket.broadcast
          .to(origin.conversationId)
          .emit('server:conversation:typing:success', `${arg.email} is typing ...`);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:typing:error', `${error.message}`);
        } else {
          socket.emit('server:conversation:typing:error', `Unexpected error. Something went wrong`);
        }
      }
    });

    // On user create new message
    socket.on('client:conversation:message:post', async (origin, arg) => {
      try {
        const newDirectMessage = await createDirectMessage(origin, arg);
        io.to(origin.conversationId).emit(
          'server:conversation:message:post:success',
          newDirectMessage,
        );
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:message:post:error', `${error.message}`);
        } else {
          socket.emit(
            'server:conversation:message:post:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });

    // On user upload a file
    socket.on('client:conversation:message:upload', async (origin, arg) => {
      try {
        const newDirectMessage = await uploadDirectMessageFile(origin, arg);
        io.to(origin.conversationId).emit(
          'server:conversation:message:upload:success',
          newDirectMessage,
        );
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:message:upload:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit(
            'server:conversation:message:upload:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });

    // On user update message
    socket.on('client:conversation:message:update', async (origin, arg) => {
      try {
        const updatedDirectMessage = await updateDirectMessage(origin, arg);
        io.to(origin.conversationId).emit(
          'server:conversation:message:update:success',
          updatedDirectMessage,
        );
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:message:update:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit(
            'server:conversation:message:update:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });

    // On user delete message
    socket.on('client:conversation:message:delete', async (origin, arg) => {
      try {
        const deletedDirectMessage = await deleteDirectMesage(origin, arg);
        io.to(origin.conversationId).emit(
          'server:conversation:message:delete:success',
          deletedDirectMessage,
        );
      } catch (error: any) {
        if (error instanceof ValidationError) {
          socket.emit('server:conversation:message:delete:error', `${error.message}`);
          console.log(error);
        } else {
          socket.emit(
            'server:conversation:message:delete:error',
            `Unexpected error. Something went wrong`,
          );
        }
      }
    });

    // On user join meeting
    socket.on('client:meeting:join', (origin, arg) => {
      socket.join(origin.groupId);

      try {
        createMeetingState(origin.groupId, arg);
        console.log(arg.email + ' join the meeting');
        console.log(fakeRedis);
        const updatedStates = getMeetingStates(origin.groupId);
        // Gửi danh sách trạng thái về người join
        socket.emit('server:meeting:join:success', updatedStates);
        // Broad cast cập nhật trạng thái
        socket.broadcast.to(origin.groupId).emit('server:meeting:state', updatedStates);
        
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:meeting:join:error', `${error.message}`);
        } else {
          socket.emit('server:meeting:join:error', `Unexpected error. Something went wrong`);
        }
      }
    });
    // On user leave meeting
    socket.on('client:meeting:leave', (origin, arg) => {
      socket.leave(origin.groupId);
      
      try {
        deleteMeetingState(origin.groupId, arg);
        console.log(fakeRedis);
        const updatedStates = getMeetingStates(origin.groupId);
        // Broad cast cập nhật trạng thái
        socket.to(origin.groupId).emit('server:meeting:state', updatedStates);
        console.log('user out group: ' + origin.profileId);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:meeting:leave:error', `${error.message}`);
        } else {
          socket.emit('server:meeting:leave:error', `Unexpected error. Something went wrong`);
        }
      }
    });
    // On user toggle camera
    socket.on('client:meeting:camera', (origin, arg) => {
      try {
        updateMeetingState(origin.groupId, arg, 'camera');
        console.log(origin.profileId + ' click camera');
        console.log(fakeRedis);
        const updatedStates = getMeetingStates(origin.groupId);
        // Cập nhật trạng thái cho tất cả
        io.to(origin.groupId).emit('server:meeting:state', updatedStates);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:meeting:camera:error', `${error.message}`);
        } else {
          socket.emit('server:meeting:camera:error', `Unexpected error. Something went wrong`);
        }
      }
    });
    // On user toggle mic
    socket.on('client:meeting:mic', (origin, arg) => {
      try {
        updateMeetingState(origin.groupId, arg, 'mic');
        console.log(origin.profileId + ' click mic');
        console.log(fakeRedis);
        const updatedStates = getMeetingStates(origin.groupId);
        // Cập nhật trạng thái cho tất cả
        io.to(origin.groupId).emit('server:meeting:state', updatedStates);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:meeting:mic:error', `${error.message}`);
        } else {
          socket.emit('server:meeting:mic:error', `Unexpected error. Something went wrong`);
        }
      }
    });
    // On user turn on share screen
    socket.on('client:meeting:screen:on', (origin, arg) => {
      socket.join(origin.groupId);

      try {
        createMeetingState(origin.groupId, arg);

        const updatedStates = getMeetingStates(origin.groupId);
        // Gửi danh sách trạng thái về người join
        socket.emit('server:meeting:screen:on:success', updatedStates);
        // Broad cast cập nhật trạng thái
        socket.broadcast.to(origin.groupId).emit('server:meeting:state', updatedStates);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:meeting:screen:on:error', `${error.message}`);
        } else {
          socket.emit('server:meeting:screen:on:error', `Unexpected error. Something went wrong`);
        }
      }
    });
    // On user turn off share screen
    socket.on('client:meeting:screen:off', (origin, arg) => {
      try {
        deleteMeetingState(origin.groupId, arg);

        const updatedStates = getMeetingStates(origin.groupId);
        socket.emit('server:meeting:screen:off:success', updatedStates);
        // Broad cast cập nhật trạng thái
        socket.broadcast.to(origin.groupId).emit('server:meeting:state', updatedStates);
      } catch (error: any) {
        console.log(error);
        if (error instanceof ValidationError) {
          socket.emit('server:meeting:screen:off:error', `${error.message}`);
        } else {
          socket.emit('server:meeting:screen:off:error', `Unexpected error. Something went wrong`);
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

const uploadMessageFile = async (
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

const createDirectMessage = async (
  ...args: Parameters<ClientToServerEvents['client:conversation:message:post']>
) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.conversationId || !origin.roomId) {
    throw new ValidationError('Require conversation id, group id and room id');
  }
  if (!arg.content) {
    throw new ValidationError('Require message content');
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: origin.conversationId,
      OR: [
        {
          memberOne: {
            profileId: origin.profileId,
          },
        },
        {
          memberTwo: {
            profileId: origin.profileId,
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
    throw new ValidationError('Conversation not exist');
  }
  let currentMember: Member | undefined;
  if (conversation.memberOne.profileId === origin.profileId) {
    currentMember = conversation.memberOne;
  }
  if (conversation.memberTwo.profileId === origin.profileId) {
    currentMember = conversation.memberTwo;
  }
  if (!currentMember) {
    throw new ValidationError('Can not create message. You are not member of this conversation');
  }

  const newDirectMessage = db.directMessage.create({
    data: {
      content: arg.content,
      fileUrl: null,
      memberId: currentMember.id,
      conversationId: origin.conversationId,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });
  return newDirectMessage;
};

const uploadDirectMessageFile = async (
  ...args: Parameters<ClientToServerEvents['client:conversation:message:upload']>
) => {
  const [origin, file] = args;
  if (!origin.profileId || !origin.conversationId || !origin.roomId) {
    throw new ValidationError('Require conversation id, group id and room id');
  }

  if (file.filesize > convertMbToBytes(IMAGE_SIZE_LIMIT_IN_MB)) {
    throw new ValidationError('File size not over 5 MB');
  }

  const conversation = await db.conversation.findFirst({
    where: {
      id: origin.conversationId,
      OR: [
        {
          memberOne: {
            profileId: origin.profileId,
          },
        },
        {
          memberTwo: {
            profileId: origin.profileId,
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
    throw new ValidationError('Conversation not exist');
  }
  let currentMember: Member | undefined;
  if (conversation.memberOne.profileId === origin.profileId) {
    currentMember = conversation.memberOne;
  }
  if (conversation.memberTwo.profileId === origin.profileId) {
    currentMember = conversation.memberTwo;
  }
  if (!currentMember) {
    throw new ValidationError('Can not create message. You are not member of this conversation');
  }

  const relFolderPath = `/public/conversations/${origin.conversationId}`;
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

  const newDirectMessage = db.directMessage.create({
    data: {
      content: 'This message is a file',
      fileUrl: relFilePath,
      memberId: currentMember.id,
      conversationId: origin.conversationId,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });
  return newDirectMessage;
};

const updateDirectMessage = async (
  ...args: Parameters<ClientToServerEvents['client:conversation:message:update']>
) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.conversationId || !origin.roomId) {
    throw new ValidationError('Require conversation id, group id and room id');
  }
  const directMessageId = arg.messageId;
  if (!arg.content || !directMessageId) {
    throw new ValidationError('Require direct message id and message content');
  }

  const directMessage = await db.directMessage.findUnique({
    where: { id: directMessageId },
  });
  if (!directMessage) {
    throw new ValidationError(`Direct message ${directMessageId} not found`);
  }

  const owner = await db.member.findUnique({
    where: { id: directMessage.memberId },
  });
  if (!owner) {
    throw new ValidationError('The owner of this message was not found');
  }
  if (owner.profileId !== origin.profileId) {
    throw new ValidationError('Only the author can edit his / her direct message');
  }

  const updatedDirectMessage = await db.directMessage.update({
    where: {
      id: directMessageId,
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
  return updatedDirectMessage;
};

const deleteDirectMesage = async (
  ...args: Parameters<ClientToServerEvents['client:conversation:message:delete']>
) => {
  const [origin, arg] = args;
  if (!origin.profileId || !origin.conversationId || !origin.roomId) {
    throw new ValidationError('Require conversation id, group id and room id');
  }
  const directMessageId = arg.messageId;
  if (!directMessageId) {
    throw new ValidationError('Require direct message id');
  }

  const directMessage = await db.directMessage.findUnique({
    where: { id: directMessageId },
  });
  if (!directMessage) {
    throw new ValidationError(`Direct message ${directMessageId} not found`);
  }

  const owner = await db.member.findUnique({
    where: { id: directMessage.memberId },
  });
  if (!owner) {
    throw new ValidationError('The owner of this message was not found');
  }
  if (owner.profileId !== origin.profileId) {
    throw new ValidationError('Only the author can edit his / her direct message');
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
  return deletedDirectMessage;
};

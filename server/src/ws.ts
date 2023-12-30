import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { db } from './prisma/db';
import { Message, MemberRole } from '@prisma/client';
import { corsOptions } from './lib/config';

export type ServerToClientEvents = {
  'server:group:join': (msg: string) => void;
  'server:group:leave': (msg: string) => void;
  'server:group:typing': (msg: string) => void;
  'server:group:message:get': (messages: Message[]) => void;
  'server:group:message:post': (message: Message) => void;
  'server:group:message:update': (messages: Message) => void;
  'server:group:message:delete': (messages: Message) => void;
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

export type MessageTyping = { email: string };
export type MessageCreate = { content: string; fileUrl?: string };
export type MessageUpdate = { messageId: string; content: string };
export type MessageDelete = { messageId: string };

export type ClientToServerEvents = {
  'client:group:join': (origin: GroupOrigin) => void;
  'client:group:leave': (origin: GroupOrigin) => void;
  'client:group:typing': (origin: GroupOrigin, arg: MessageTyping) => void;
  'client:group:message:get': (origin: GroupOrigin) => void;
  'client:group:message:post': (origin: GroupOrigin, arg: MessageCreate) => void;
  'client:group:message:update': (origin: GroupOrigin, arg: MessageUpdate) => void;
  'client:group:message:delete': (origin: GroupOrigin, arg: MessageDelete) => void;
};

export function setupWs(httpServer: HTTPServer) {
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    path: '/api/socket',
    serveClient: false,
    addTrailingSlash: false,
    cors: corsOptions,
  });

  io.on('connection', socket => {
    // On user join group
    socket.on('client:group:join', async origin => {
      console.log('User join');

      socket.join(origin.groupId);
      // On user join group - to user only
      socket.emit('server:group:join', `You just join group ${origin.groupId}`);
      // On user join group - to other user in group
      socket.broadcast
        .to(origin.groupId)
        .emit('server:group:join', `Profile ${origin.profileId} just join group`);
      // On user join group - get all messages
      socket.emit('server:group:message:get', await getMessagesByGroupId(origin));
    });

    // On user leave group
    socket.on('client:group:leave', async origin => {
      console.log('User leave');

      socket.leave(origin.groupId);
      io.to(origin.groupId).emit(
        'server:group:leave',
        `Profile ${origin.profileId} just leave group`,
      );
    });

    // On user typing
    socket.on('client:group:typing', async (origin, arg) => {
      socket.broadcast.to(origin.groupId).emit('server:group:typing', `${arg.email} is typing ...`);
    });

    // On user send message
    socket.on('client:group:message:post', async (origin, arg) => {
      const newMessage = await createMessage(origin, arg);
      io.to(origin.groupId).emit('server:group:message:post', newMessage);
    });

    // On user update message
    socket.on('client:group:message:update', async (origin, arg) => {
      const updatedMessage = await updateMessage(origin, arg);
      io.to(origin.groupId).emit('server:group:message:update', updatedMessage!);
    });

    // On user delete message
    socket.on('client:group:message:delete', async (origin, arg) => {
      const deletedMessage = await deleteMesage(origin, arg);
      io.to(origin.groupId).emit('server:group:message:delete', deletedMessage);
    });
  });

  return io;
}

const getMessagesByGroupId = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:get']>
) => {
  const [origin] = args;
  const messages = await db.message.findMany({
    where: {
      groupId: origin.groupId,
    },
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
  return messages;
};

const createMessage = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:post']>
) => {
  const [origin, arg] = args;
  const member = await db.member.findFirst({
    where: {
      profileId: origin.profileId,
      roomId: origin.roomId,
    },
  });

  const message = await db.message.create({
    data: {
      content: arg.content,
      fileUrl: arg.fileUrl,
      groupId: origin.groupId,
      memberId: member?.id!,
      deleted: false,
    },
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });
  return message;
};

const updateMessage = async (
  ...args: Parameters<ClientToServerEvents['client:group:message:update']>
) => {
  const [origin, arg] = args;
  const message = await db.message.findUnique({
    where: { id: arg.messageId },
  });
  const member = await db.member.findUnique({
    where: { id: message?.memberId },
  });
  if (member?.profileId !== origin.profileId) {
    return message;
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

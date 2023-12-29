import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export type ServerToClientEvents = {
  'server:join': (msg: string) => void;
  'server:leave': (msg: string) => void;
  'server:typing': (msg: string) => void;
  'server:message': (msg: string) => void;
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

export type ClientToServerEvents = {
  'client:group:join': (org: GroupOrigin) => void;
  'client:group:leave': (org: GroupOrigin) => void;
  'client:group:typing': (org: GroupOrigin) => void;
  'client:group:message': (content: string, org: GroupOrigin) => void;
};

export function setupWs(httpServer: HTTPServer) {
  const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    path: '/api/socket',
    serveClient: false,
    addTrailingSlash: false,
    cors: {
      credentials: true,
    },
  });

  io.on('connection', socket => {
    socket.on('client:group:join', async ({ groupId, profileId, roomId }) => {
      socket.join(groupId);
      // On user join group - to user only
      socket.emit('server:join', `You just join group ${groupId}`);
      // On user join group - to other user in group
      socket.broadcast.to(groupId).emit('server:join', `Profile ${profileId} just join group`);
    });

    // On user leave group
    socket.on('client:group:leave', async ({ groupId, profileId }) => {
      socket.leave(groupId);
      io.to(groupId).emit('server:leave', profileId);
    });

    // On user typing
    socket.on('client:group:typing', async ({ groupId, profileId, roomId }) => {
      socket.broadcast.to(groupId).emit('server:typing', `Profile ${profileId} is typing`);
    });

    // On user send message
    socket.on('client:group:message', async (content, { groupId }) => {
      io.to(groupId).emit('server:message', content);
    });
  });
}

import { Server as SocketServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

type ServerToClientEvents = {
  'chat:broadcast:message': (msg: string) => void;
};

type ClientToServerEvents = {
  'chat:send:message': (content: string) => void;
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
    socket.on('chat:send:message', content => {
      io.emit('chat:broadcast:message', content);
    });
  });
}

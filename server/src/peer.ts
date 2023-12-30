import { ExpressPeerServer } from 'peer';
import { Server as HTTPServer } from 'http';
import { corsOptions } from './lib/config';

export const setupPeerServer = (httpServer: HTTPServer) => {
  const peerServer = ExpressPeerServer(httpServer, {
    path: '/',
    corsOptions,
  });

  peerServer.on('connection', client => {});
  peerServer.on('disconnect', client => {});

  return peerServer;
};

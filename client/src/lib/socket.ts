import { SERVER_SOCKET_API_PATH, SERVER_URL } from './constants';
import { io, Socket } from 'socket.io-client';

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

export type SocketApi = Socket<ServerToClientEvents, ClientToServerEvents>;

export const getSocket = () =>
  io(SERVER_URL, {
    path: SERVER_SOCKET_API_PATH,
    addTrailingSlash: false,
  }) as SocketApi;

export const socket = io(SERVER_URL, {
  path: SERVER_SOCKET_API_PATH,
  addTrailingSlash: false,
}) as SocketApi;

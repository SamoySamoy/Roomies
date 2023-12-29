import { SERVER_SOCKET_API_PATH, SERVER_URL } from './constants';
import { io, Socket } from 'socket.io-client';
import { Message } from './types';

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
export type MessageCreate = { content: string };
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

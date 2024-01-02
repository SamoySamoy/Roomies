import { SERVER_SOCKET_API_PATH, SERVER_URL } from './constants';
import { io, Socket } from 'socket.io-client';
import { MemberRole, Message } from './types';

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

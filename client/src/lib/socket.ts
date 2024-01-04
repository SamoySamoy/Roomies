import { SERVER_SOCKET_API_PATH, SERVER_URL } from './constants';
import { io, Socket } from 'socket.io-client';
import { DirectMessage, MemberRole, Message } from './types';

export type MeetingState = {
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

  'server:peer:init:success': (id: string) => void;
  'server:user-disconnected': (id: string) => void;

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
  'server:meeting:disconnect': (id: string) => void;
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

  'client:peer:init:success': (origin: GroupOrigin) => void;

  'client:meeting:join': (origin: GroupOrigin, arg: MeetingState) => void;
  'client:meeting:leave': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
  'client:meeting:camera': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
  'client:meeting:mic': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
  'client:meeting:screen:on': (origin: GroupOrigin, arg: MeetingState) => void;
  'client:meeting:screen:off': (origin: GroupOrigin, arg: MeetingStateIdentity) => void;
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

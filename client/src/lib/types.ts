// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT

export enum RoomType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  HIDDEN = 'HIDDEN',
}

export enum MemberRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST',
}

export enum GroupType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
}

export interface Profile {
  id: string;
  email: string;
  password: string;
  imageUrl?: string;
  rooms: Room[];
  groups: Group[];
  members: Member[];
  ResetToken: ResetToken[];
  RefreshToken: RefreshToken[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResetToken {
  id: string;
  profileId: string;
  profile: Profile;
  resetToken: string;
}

export interface RefreshToken {
  id: string;
  profileId: string;
  profile: Profile;
  refreshToken: string;
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  password?: string;
  imageUrl?: string;
  inviteCode: string;
  profileId: string;
  profile: Profile;
  groups: Group[];
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  role: MemberRole;
  profileId: string;
  profile: Profile;
  roomId: string;
  room: Room;
  messages: Message[];
  directMessages: DirectMessage[];
  conversationsInitiated: Conversation[];
  conversationsReceived: Conversation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  type: GroupType;
  profileId: string;
  profile: Profile;
  roomId: string;
  room: Room;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  fileUrl?: string;
  memberId: string;
  member: Member;
  groupId: string;
  group: Group;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  memberOneId: string;
  memberOne: Member;
  memberTwoId: string;
  memberTwo: Member;
  directMessages: DirectMessage[];
}

export interface DirectMessage {
  id: string;
  content: string;
  fileUrl?: string;
  memberId: string;
  member: Member;
  conversationId: string;
  conversation: Conversation;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

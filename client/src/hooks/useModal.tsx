import { create } from 'zustand';
import { Group, Room } from '@/lib/types';
import { GroupType } from '@/lib/types';
import { ConversationOrigin, GroupOrigin } from '@/lib/socket';

export type ModalType =
  | 'createRoom'
  | 'editRoom'
  | 'leaveRoom'
  | 'deleteRoom'
  | 'createGroup'
  | 'editGroup'
  | 'deleteGroup'
  | 'inviteCode'
  | 'members'
  | 'messageFile'
  | 'deleteMessage'
  | 'joinPublicRoom'
  | 'joinPrivateRoom'
  | 'joinByInviteCode'
  | 'profile';

export type ModalData = {
  room?: Room;
  group?: Group;
  groupType?: GroupType;
  groupOrigin?: GroupOrigin;
  conversationOrigin?: ConversationOrigin;
  messageId?: string;
};

export type ModalState = {
  modalType: ModalType | null;
  isOpen: boolean;
  data: ModalData;
};

export type ModalActions = {
  openModal: (arg: OpenModalArg) => void;
  closeModal: () => void;
};

export type OpenModalArg = {
  modalType: ModalType;
  data?: ModalData;
};

export const useModal = create<ModalState & ModalActions>(set => ({
  modalType: null,
  isOpen: false,
  data: {},
  openModal: ({ modalType, data = {} }) =>
    set({
      modalType,
      isOpen: true,
      data,
    }),
  closeModal: () => set({ modalType: null, isOpen: false, data: {} }),
}));

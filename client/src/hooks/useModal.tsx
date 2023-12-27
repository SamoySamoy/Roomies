import { create } from 'zustand';
import { Group, Room } from '@/lib/types';
import { GroupType } from '@/lib/types';

export type ModalType =
  | 'createRoom'
  | 'editRoom'
  | 'leaveRoom'
  | 'deleteRoom'
  | 'createGroup'
  | 'editGroup'
  | 'deleteGroup'
  | 'invite'
  | 'members'
  | 'messageFile'
  | 'deleteMessage';

export type ModalData = {
  room?: Room;
  groupType?: GroupType;
  group?: Group;
  apiUrl?: string;
  query?: Record<string, any>;
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

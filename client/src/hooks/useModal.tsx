import { create } from 'zustand';
import { Channel, Server } from '@/lib/types';
import { ChannelType } from '@/lib/types';

export type ModalType =
  | 'createServer'
  | 'editServer'
  | 'leaveServer'
  | 'deleteServer'
  | 'createChannel'
  | 'editChannel'
  | 'deleteChannel'
  | 'invite'
  | 'members'
  | 'messageFile'
  | 'deleteMessage';

export type ModalData = {
  server?: Server;
  channelType?: ChannelType;
  channel?: Channel;
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

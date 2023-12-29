import { create } from 'zustand';
import { Room } from '@/lib/types';

export type ModalState = {
  currentRoom?: Room;
};

export type ModalActions = {
  setCurrentRoom: (room: Room | undefined) => void;
};

export const useCurrentRoom = create<ModalState & ModalActions>(set => ({
  currentRoom: undefined,
  setCurrentRoom: room =>
    set({
      currentRoom: room,
    }),
}));

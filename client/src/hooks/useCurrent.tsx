import { create } from 'zustand';
import { Group, Room } from '@/lib/types';

export type ModalState = {
  currentRoom?: Room;
  currentGroup?: Group;
};

export type ModalActions = {
  setCurrentRoom: (room: Room | undefined) => void;
  setCurrentGroup: (group: Group | undefined) => void;
};

export const useCurrent = create<ModalState & ModalActions>(set => ({
  currentRoom: undefined,
  currentGroup: undefined,
  setCurrentRoom: room =>
    set({
      currentRoom: room,
    }),
  setCurrentGroup: group =>
    set({
      currentGroup: group,
    }),
}));

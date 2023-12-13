import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Server } from '@/lib/types';

export type ModalType = 'createServer' | 'invite' | 'editServer';

export type ModalData = {
  server?: Server;
};

export type ModalState = {
  modalType: ModalType | null;
  isOpen: boolean;
  data: ModalData;
};

const initialState: ModalState = {
  modalType: null,
  isOpen: false,
  data: {},
};

export type OpenModalPlayLoad = {
  modalType: ModalType;
  data?: ModalData;
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<OpenModalPlayLoad>) => {
      state.isOpen = true;
      state.modalType = action.payload.modalType;
      state.data = action.payload.data || {};
    },
    closeModal: state => {
      state.isOpen = false;
      state.modalType = null;
      state.data = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = modalSlice.actions;

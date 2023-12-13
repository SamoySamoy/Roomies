import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 'createServer';

export type ModalState = {
  modalType: ModalType | null;
  isOpen: boolean;
};

const initialState: ModalState = {
  modalType: null,
  isOpen: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.isOpen = true;
      state.modalType = action.payload;
    },
    closeModal: state => {
      state.isOpen = false;
      state.modalType = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = authSlice.actions;

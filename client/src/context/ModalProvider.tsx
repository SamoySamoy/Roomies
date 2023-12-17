import { useAppDispatch, useAppSelector } from '@/redux/store';
import { closeModal, openModal, OpenModalPlayLoad } from '@/redux/slices/modalSlice';

import CreateServerModal from '@/components/modals/CreateServerModal';
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import MembersModal from '@/components/modals/MembersModal';
import CreateChannelModal from '@/components/modals/CreateChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import LeaveServerModal from '@/components/modals/LeaveServerModal';
import DeleteServerModal from '@/components/modals/DeleteServerModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';

export default function ModalProvider() {
  return (
    <>
      <CreateServerModal />
      <EditServerModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <InviteModal />
      <MembersModal />
    </>
  );
}

export const useModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, modalType, data } = useAppSelector(state => state.modal);
  return {
    isOpen,
    modalType,
    openModal: (arg: OpenModalPlayLoad) => dispatch(openModal(arg)),
    closeModal: () => dispatch(closeModal()),
    data,
  };
};

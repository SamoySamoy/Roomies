import CreateServerModal from '@/components/modals/CreateServerModal';
import InviteModal from '@/components/modals/InviteModal';
import EditServerModal from '@/components/modals/EditServerModal';
import MembersModal from '@/components/modals/MembersModal';
import CreateChannelModal from '@/components/modals/CreateChannelModal';
import EditChannelModal from '@/components/modals/EditChannelModal';
import LeaveServerModal from '@/components/modals/LeaveServerModal';
import DeleteServerModal from '@/components/modals/DeleteServerModal';
import DeleteChannelModal from '@/components/modals/DeleteChannelModal';
import MessageFileModal from '@/components/modals/MessageFileModal';
import DeleteMessageModal from '@/components/modals/DeleteMessageModal';
import { useModal, ModalType } from '@/hooks/useModal';

const modalMap: Record<ModalType, React.FC> = {
  createServer: CreateServerModal,
  editServer: EditServerModal,
  leaveServer: LeaveServerModal,
  deleteServer: DeleteServerModal,
  createChannel: CreateChannelModal,
  editChannel: EditChannelModal,
  deleteChannel: DeleteChannelModal,
  invite: InviteModal,
  members: MembersModal,
  messageFile: MessageFileModal,
  deleteMessage: DeleteMessageModal,
};

export default function ModalProvider() {
  const { isOpen, modalType } = useModal();

  if (!isOpen || !modalType) {
    return null;
  }

  const Modal = modalMap[modalType];
  return <Modal />;
}

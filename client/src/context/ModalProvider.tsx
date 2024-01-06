import CreateRoomModal from '@/components/Modals/CreateRoomModal';
import InviteCodeModal from '@/components/Modals/InviteCodeModal';
import EditRoomModal from '@/components/Modals/EditRoomModal';
import MembersModal from '@/components/Modals/MembersModal';
import CreateGroupModal from '@/components/Modals/CreateGroupModal';
import EditGroupModal from '@/components/Modals/EditGroupModal';
import LeaveRoomModal from '@/components/Modals/LeaveRoomModal';
import DeleteRoomModal from '@/components/Modals/DeleteRoomModal';
import DeleteGroupModal from '@/components/Modals/DeleteGroupModal';
import MessageFileModal from '@/components/Modals/MessageFileModal';
import DeleteMessageModal from '@/components/Modals/DeleteMessageModal';
import JoinPrivateRoomModal from '@/components/Modals/JoinPrivateRoomModal';
import JoinPublicRoomModal from '@/components/Modals/JoinPublicRoomModal';
import JoinByInviteCodeModal from '@/components/Modals/JoinByInviteCodeModal';
import ProfileModal from '@/components/Modals/ProfileModal';
import { useModal, ModalType } from '@/hooks/useModal';
import ImageModal from '@/components/Modals/ImageModal';

const modalMap: Record<ModalType, React.FC> = {
  createRoom: CreateRoomModal,
  editRoom: EditRoomModal,
  leaveRoom: LeaveRoomModal,
  deleteRoom: DeleteRoomModal,
  createGroup: CreateGroupModal,
  editGroup: EditGroupModal,
  deleteGroup: DeleteGroupModal,
  inviteCode: InviteCodeModal,
  members: MembersModal,
  messageFile: MessageFileModal,
  deleteMessage: DeleteMessageModal,
  joinPrivateRoom: JoinPrivateRoomModal,
  joinPublicRoom: JoinPublicRoomModal,
  joinByInviteCode: JoinByInviteCodeModal,
  profile: ProfileModal,
  image: ImageModal,
};

export default function ModalProvider() {
  const { isOpen, modalType } = useModal();

  if (!isOpen || !modalType) {
    return null;
  }

  const Modal = modalMap[modalType];
  return <Modal />;
}

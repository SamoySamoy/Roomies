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
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
}

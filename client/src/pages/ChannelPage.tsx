import { Navigate, useParams } from 'react-router-dom';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatInput from '@/components/Chat/ChatInput';
import ChatMessages from '@/components/Chat/ChatMessages';
import { GroupOrigin } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { useRoomQuery } from '@/hooks/queries';
import { LoadingPage } from '@/components/Loading';

const ChannelPage = () => {
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };

  const {
    data: room,
    isPending,
    isFetching,
    isRefetching,
    isError,
  } = useRoomQuery(roomId!, {
    groups: true,
    members: true,
    profilesOfMembers: true,
  });
  const currentGroup = room?.groups.find(group => group.id === groupId);
  const currentMember = room?.members.find(member => member.profileId === auth.profileId);

  if (isPending || isFetching || isRefetching) {
    return <LoadingPage />;
  }
  if (isError || !room) {
    return <Navigate to={'/error-page'} replace />;
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={currentGroup?.name!} type='group' />
      <ChatMessages
        key={groupId}
        name={currentGroup?.name!}
        type='group'
        origin={origin}
        currentGroup={currentGroup!}
        currentMember={currentMember!}
      />
      <ChatInput name={currentGroup?.name!} type='group' origin={origin} />
    </div>
  );
};

export default ChannelPage;

import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useConversationQuery, useRoomQuery } from '@/hooks/queries';
import { LoadingPage } from '@/components/Loading';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ChatHeader from '@/components/Conversation/ChatHeader';
import ChatInput from '@/components/Conversation/ChatInput';
import ChatMessages from '@/components/Conversation/ChatMessages';
import { ConversationOrigin } from '@/lib/socket';

const ConversationPage = () => {
  const { auth } = useAuth();
  const { memberId: otherMemberId, roomId } = useParams<{ memberId: string; roomId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryObj = {
    groups: true,
    members: true,
    profilesOfMembers: true,
  } as const;
  const {
    data: room,
    isPending: isRoomPending,
    isFetching: isRoomFetching,
    isError: isRoomError,
  } = useRoomQuery(roomId!, queryObj);
  const currentMember = room?.members.find(member => member.profileId === auth.profileId);
  const {
    data: conversation,
    isPending: isConversationPending,
    isFetching: isConversationFetching,
    isError: isConversationError,
  } = useConversationQuery(
    {
      memberOneId: currentMember?.id!,
      memberTwoId: otherMemberId!,
      createIfNotExist: true,
    },
    {
      enabled: Boolean(currentMember),
    },
  );

  const origin: ConversationOrigin = {
    conversationId: conversation?.id!,
    profileId: auth.profileId!,
    roomId: roomId!,
  };

  if (isRoomPending || isRoomFetching || isConversationPending || isConversationFetching) {
    return <LoadingPage />;
  }
  if (isRoomError || !room || isConversationError || !conversation) {
    return <Navigate to={'/error-page'} replace />;
  }

  if (!Boolean(currentMember)) {
    return <Navigate to={'/not-member'} replace />;
  }

  if (currentMember?.id === otherMemberId) {
    return <Navigate to={'/my-rooms'} replace />;
  }

  const { memberOne, memberTwo } = conversation;
  const otherMember = memberOne.profileId === auth.profileId ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        email={otherMember.profile.email}
        type='conversation'
      />
      <ChatMessages
        key={conversation.id}
        name={otherMember.profile.email}
        type='conversation'
        conversationOrigin={origin}
        currentConversation={conversation}
        currentMember={currentMember!}
      />
      <ChatInput name={otherMember.profile.email} type='conversation' conversationOrigin={origin} />
    </div>
  );
};

export default ConversationPage;

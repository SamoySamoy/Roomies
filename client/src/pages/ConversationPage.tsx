import ChatHeader from '@/components/Chat/ChatHeader';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { conversations, members } from '@/lib/fakeData';
import { ChatInput } from '@/components/Chat/ChatInput';
import { ChatMessages } from '@/components/Chat/ChatMessages';

type Params = {
  roomId: string;
  memberId: string;
};

const ConversationPage = () => {
  // const profile = await currentProfile();

  // if (!profile) {
  //   return redirectToSignIn();
  // }

  // const currentMember = await db.member.findFirst({
  //   where: {
  //     serverId: params.serverId,
  //     profileId: profile.id,
  //   },
  //   include: {
  //     profile: true,
  //   },
  // });

  // if (!currentMember) {
  //   return redirect("/");
  // }

  // const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

  // if (!conversation) {
  //   return redirect(`/servers/${params.serverId}`);
  // }

  // const { memberOne, memberTwo } = conversation;

  // const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  const { memberId: otherMemberId, roomId } = useParams<Params>();
  const [searchParams, setSearchParams] = useSearchParams();
  const me = members[0];
  const otherMember = members[1];
  const conversation = conversations[0];

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profileId}
        name={otherMember.id}
        serverId={roomId!}
        type='conversation'
      />
      <div className='flex-1'>Future messages</div>
      {/* <ChatMessages
        member={me as any}
        name={otherMember.id}
        chatId={conversation.id}
        type='conversation'
        apiUrl='/api/direct-messages'
        paramKey='conversationId'
        paramValue={conversation.id}
        socketUrl='/api/socket/direct-messages'
        socketQuery={{
          conversationId: conversation.id,
        }}
      /> */}
      <ChatInput
        name={otherMember.id}
        type='conversation'
        apiUrl='/api/socket/direct-messages'
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default ConversationPage;

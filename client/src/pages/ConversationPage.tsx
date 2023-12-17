import ChatHeader from '@/components/chat/ChatHeader';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { members } from '@/lib/fakeData';

type Params = {
  roomId: string;
  memberId: string;
};

const ConversationPage = () => {
  const { memberId: otherMemberId, roomId } = useParams<Params>();
  const [searchParams, setSearchParams] = useSearchParams();
  const me = members[0];
  const otherMember = members[1];

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

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profileId}
        name={otherMember.id}
        serverId={roomId!}
        type='conversation'
      />
    </div>
  );
};

export default ConversationPage;

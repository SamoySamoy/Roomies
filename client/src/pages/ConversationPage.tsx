import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatInput from '@/components/Chat/ChatInput';
import ChatMessages from '@/components/Chat/ChatMessages';
import { useEffect } from 'react';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { useGroupQuery } from '@/hooks/queries';
import { useCurrent } from '@/hooks/useCurrent';
import { LoadingPage } from '@/components/Loading';
import { Message } from '@/lib/types';

const ChannelPage = () => {
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const {
    data: group,
    isPending,
    isError,
  } = useGroupQuery(groupId!, {
    // messages: true,
    profile: true,
  });

  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };

  if (isPending) {
    return <LoadingPage />;
  }
  if (isError) {
    return <Navigate to={'/error-page'} replace />;
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={group.name} type='group' />
      {/* <div className='flex-1'>
        {messages.map((m, i) => (
          <p key={i}>{m.content}</p>
        ))}
        {typing && <p>{typing}</p>}
        {join && <p>{join}</p>}
        {leave && <p>{leave}</p>}
      </div> */}
      <ChatMessages origin={origin} />
      {/* <ChatMessages
        group={group}
        room={currentRoom!}
        member={me as any}
        name={group.name}
        chatId={group.id}
        type='group'
        apiUrl='/api/messages'
        socketUrl='/api/socket/messages'
        socketQuery={{
          groupId: group.id,
          roomId: group.roomId,
        }}
        paramKey='groupId'
        paramValue={group.id}
      /> */}
      <ChatInput name={group.name} type='group' origin={origin} />
    </div>
  );
};

export default ChannelPage;

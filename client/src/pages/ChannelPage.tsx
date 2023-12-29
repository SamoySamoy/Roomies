import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import ChatHeader from '@/components/Chat/ChatHeader';
import { ChatInput } from '@/components/Chat/ChatInput';
import { ChatMessages } from '@/components/Chat/ChatMessages';
import { useEffect } from 'react';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { useGroupQuery } from '@/hooks/queries';
import { useCurrentRoom } from '@/hooks/useCurrentRoom';
import { LoadingPage } from '@/components/Loading';

const ChannelPage = () => {
  const { auth } = useAuth();
  const { groupId } = useParams<{ groupId: string }>();
  const { currentRoom } = useCurrentRoom();
  const {
    data: group,
    isPending,
    isError,
  } = useGroupQuery(groupId!, {
    messages: true,
    profile: true,
  });

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
          <p key={i}>{m}</p>
        ))}
        {typing && <p>{typing} is typing ...</p>}
        {join && <p>{join} just joined</p>}
        {leave && <p>{leave} just leaved</p>}
      </div> */}
      <ChatMessages
        group={group}
        room={currentRoom!}
        // member={me as any}
        // name={group.name}
        // chatId={group.id}
        // type='group'
        // apiUrl='/api/messages'
        // socketUrl='/api/socket/messages'
        // socketQuery={{
        //   groupId: group.id,
        //   roomId: group.roomId,
        // }}
        // paramKey='groupId'
        // paramValue={group.id}
      />
      <ChatInput
        name={group.name}
        type='group'
        apiUrl='/api/socket/messages'
        query={{
          groupId: group.id,
          // roomId: currentRoom?.id,
        }}
      />
    </div>
  );
};

export default ChannelPage;

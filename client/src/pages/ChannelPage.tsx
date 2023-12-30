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
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };
  const { currentRoom } = useCurrent();
  const currentGroup = currentRoom?.groups.find(group => group.id === groupId);
  const currentMember = currentRoom?.members.find(member => member.profileId === auth.profileId);

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={currentGroup?.name!} type='group' />
      <ChatMessages
        name={currentGroup?.name!}
        type='group'
        origin={origin}
        currentGroup={currentGroup!}
        currentMember={currentMember!}
        currentRoom={currentRoom!}
        key={groupId}
      />
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
      <ChatInput
        name={currentGroup?.name!}
        type='group'
        origin={origin}
        currentMember={currentMember!}
      />
    </div>
  );
};

export default ChannelPage;

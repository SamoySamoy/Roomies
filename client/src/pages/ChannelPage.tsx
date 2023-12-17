import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { members, channels, servers } from '@/lib/fakeData';
import ChatHeader from '@/components/chat/ChatHeader';

type Params = {
  roomId: string;
  channelId: string;
};

const ChannelPage = () => {
  const { channelId, roomId } = useParams<Params>();

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channels[0].name} serverId={servers[0].id} type='channel' />
    </div>
  );
};

export default ChannelPage;

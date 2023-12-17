import { useNavigate, useParams } from 'react-router-dom';
import { members, channels, servers } from '@/lib/fakeData';
import ChatHeader from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessages } from '@/components/chat/ChatMessages';

type Params = {
  roomId: string;
  channelId: string;
};

const ChannelPage = () => {
  const { channelId, roomId } = useParams<Params>();

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channels[0].name} serverId={servers[0].id} type='channel' />
      <div className='flex-1'>Future messages</div>
      {/* <ChatMessages
        member={members[0] as any}
        name={channelId!}
        chatId={channelId!}
        type='channel'
        apiUrl=''
        socketUrl=''
        socketQuery={{
          channelId: channelId!,
          roomId: roomId!,
        }}
        paramKey='channelId'
        paramValue={channelId!}
      /> */}
      <ChatInput
        name={channelId!}
        type='channel'
        apiUrl=''
        query={{
          channelId,
          roomId,
        }}
      />
    </div>
  );
};

export default ChannelPage;

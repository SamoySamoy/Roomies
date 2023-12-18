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
  const me = members[0];
  const channel = channels[0];

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channels[0].name} serverId={servers[0].id} type='channel' />
      <div className='flex-1'>Future messages</div>
      {/* <ChatMessages
        member={me as any}
        name={channel.name}
        chatId={channel.id}
        type='channel'
        apiUrl='/api/messages'
        socketUrl='/api/socket/messages'
        socketQuery={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        paramKey='channelId'
        paramValue={channel.id}
      /> */}
      <ChatInput
        name={channel.name}
        type='channel'
        apiUrl='/api/socket/messages'
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
      />
    </div>
  );
};

export default ChannelPage;

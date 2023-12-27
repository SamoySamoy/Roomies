import { useNavigate, useParams } from 'react-router-dom';
import { members, groups, rooms } from '@/lib/fakeData';
import ChatHeader from '@/components/Chat/ChatHeader';
import { ChatInput } from '@/components/Chat/ChatInput';
import { ChatMessages } from '@/components/Chat/ChatMessages';

type Params = {
  roomId: string;
  groupId: string;
};

const ChannelPage = () => {
  const { groupId, roomId } = useParams<Params>();
  const me = members[0];
  const group = groups[0];

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={groups[0].name} roomId={rooms[0].id} type='group' />
      <div className='flex-1'>Future messages</div>
      {/* <ChatMessages
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
        name={group.name}
        type='group'
        apiUrl='/api/socket/messages'
        query={{
          groupId: group.id,
          roomId: group.roomId,
        }}
      />
    </div>
  );
};

export default ChannelPage;

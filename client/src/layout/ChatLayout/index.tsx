import ChatHeader from './ChatHeader';
import ChatFooter from './ChatFooter';
import { Outlet } from 'react-router-dom';

type Props = {};

const ChatLayout = (props: Props) => {
  return (
    <div className='flex flex-col h-full'>
      <ChatHeader />
      <div className='flex-1'>
        <Outlet />
      </div>
      <ChatFooter />
    </div>
  );
};

export default ChatLayout;

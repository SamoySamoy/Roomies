import { Hash } from 'lucide-react';

import MobileToggle from '@/components/MobileToggle';
import MemberAvatar from '@/components/MemberAvatar';
import SocketIndicator from '@/components/SocketIndicator';

// import { SocketIndicator } from '@/components/socket-indicator';
// import { ChatVideoButton } from './chat-video-button';

interface ChatHeaderProps {
  roomId: string;
  name: string;
  type: 'group' | 'conversation';
  imageUrl?: string;
}

const ChatHeader = ({ roomId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle roomId={roomId} />
      {type === 'group' && <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2' />}
      {type === 'conversation' && (
        <MemberAvatar src={imageUrl} fallback='UN' className='h-8 w-8 md:h-8 md:w-8 mr-2' />
      )}
      <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
      <div className='ml-auto flex items-center'>
        {/* {type === 'conversation' && <ChatVideoButton />} */}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;

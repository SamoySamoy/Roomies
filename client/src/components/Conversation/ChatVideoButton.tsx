import { Video, VideoOff } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';

const ChatVideoButton = () => {
  const isVideo = true;

  const onClick = () => {};

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call';

  return (
    <ActionTooltip side='bottom' label={tooltipLabel}>
      <button onClick={onClick} className='hover:opacity-75 transition mr-4'>
        <Icon className='h-6 w-6 text-zinc-500 dark:text-zinc-400' />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;

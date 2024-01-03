import { Video, VideoOff } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { cn } from '@/lib/utils';

export type Props = {
  on: boolean;
  onClick: () => void;
};

const VideoButton = ({ on, onClick }: Props) => {
  const tooltipLabel = on ? 'Turn off Camera' : 'Turn on Camera';

  return (
    <ActionTooltip side='top' label={tooltipLabel}>
      <button
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full focus:outline-none',
          on ? 'bg-gray-700' : 'bg-rose-600',
        )}
        onClick={onClick}
      >
        {on ? (
          <Video className='text-white w-6 h-6'></Video>
        ) : (
          <VideoOff className='text-white w-6 h-6'></VideoOff>
        )}
      </button>
    </ActionTooltip>
  );
};

export default VideoButton;

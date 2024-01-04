import { MonitorUp, MonitorX } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { cn } from '@/lib/utils';
export type Props = {
  on: boolean;
  onClick: () => void;
};
const ShareScreenButton = ({ on, onClick }: Props) => {
  const tooltipLabel = on ? 'Stop sharing screen' : 'Share your screen';

  return (
    <ActionTooltip side='top' label={tooltipLabel}>
      <button
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full focus:outline-none',
          on ? 'bg-blue-600' : 'bg-gray-600',
        )}
        onClick={onClick}
      >
        {!on ? (
          <MonitorUp className='text-white w-6 h-6' />
        ) : (
          <MonitorX className='text-white w-6 h-6' />
        )}
      </button>
    </ActionTooltip>
  );
};

export default ShareScreenButton;

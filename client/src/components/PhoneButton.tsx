import { PhoneOff, Phone } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { cn } from '@/lib/utils';

export type Props = {
  on: boolean;
  onClick: () => void;
};

const PhoneButton = ({ on, onClick }: Props) => {
  const tooltipLabel = on ? 'Start meeting' : 'End meeting';

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
          <Phone className='text-white w-6 h-6' />
        ) : (
          <PhoneOff className='text-white w-6 h-6' />
        )}
      </button>
    </ActionTooltip>
  );
};

export default PhoneButton;

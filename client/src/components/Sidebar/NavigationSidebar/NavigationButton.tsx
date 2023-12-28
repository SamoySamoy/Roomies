import { Plus, Compass } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { useModal } from '@/hooks/useModal';
import { Link } from 'react-router-dom';

export const ExploreButton = () => {
  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>Explore more rooms</p>}
      >
        <Link to={'/explore'}>
          <button className='group flex items-center'>
            <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-indigo-500 dark:bg-neutral-700'>
              <Compass className='text-indigo-500 transition group-hover:text-white' size={25} />
            </div>
          </button>
        </Link>
      </ActionTooltip>
    </div>
  );
};

export const CreateRoomButton = () => {
  const { openModal } = useModal();

  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>Create a server</p>}
      >
        <button
          onClick={() =>
            openModal({
              modalType: 'createRoom',
            })
          }
          className='group flex items-center'
        >
          <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700'>
            <Plus className='text-emerald-500 transition group-hover:text-white' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

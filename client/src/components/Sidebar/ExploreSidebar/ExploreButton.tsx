import { Users } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { Link } from 'react-router-dom';

export const MyRoomsButton = () => {
  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        label={<p className='text-sm font-bold'>My rooms</p>}
      >
        <Link to={'/my-rooms'}>
          <button className='group flex items-center'>
            <div className='mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-green-500 dark:bg-neutral-700'>
              <Users className='text-green-500 transition group-hover:text-white' size={25} />
            </div>
          </button>
        </Link>
      </ActionTooltip>
    </div>
  );
};

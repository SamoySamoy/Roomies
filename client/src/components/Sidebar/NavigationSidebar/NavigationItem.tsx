import { Lock, Unlock, EyeOff, Users, PanelTopInactive } from 'lucide-react';
import ActionTooltip from '@/components/ActionToolTip';
import { cn, getImageUrl } from '@/lib/utils';
import { Room, RoomType } from '@/lib/types';
import { Link, useNavigate, useParams } from 'react-router-dom';

const icon = {
  [RoomType.PUBLIC]: <Unlock className='text-emerald-500' />,
  [RoomType.PRIVATE]: <Lock className='text-red-500' />,
  [RoomType.HIDDEN]: <EyeOff className='text-slate-500' />,
} as const;

const NavigationItem = ({ id, name, type, imageUrl }: Room) => {
  const { roomId } = useParams<{ roomId: string }>();
  const isActive = roomId === id;

  return (
    <ActionTooltip
      side='right'
      align='center'
      label={
        <div className='flex items-start gap-2'>
          <div className='flex flex-1 flex-col gap-2'>
            <p className='text-sm font-bold text-foreground'>{name}</p>
            <div className='flex gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-xs text-muted-foreground'>{1}</span>
                <PanelTopInactive size={16} className='stroke-muted-foreground' />
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-xs text-muted-foreground'>{1}</span>{' '}
                <Users size={16} className='stroke-muted-foreground' />
              </div>
            </div>
          </div>
          {icon[type]}
        </div>
      }
    >
      <Link to={`/rooms/${id}`}>
        <button className='group relative flex items-center'>
          <div
            className={cn(
              'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all',
              {
                'group-hover:h-[20px]': !isActive,
              },
              isActive ? 'h-[36px]' : 'h-[8px]',
            )}
          />
          <div
            className={cn(
              'group relative mx-3 flex h-[48px] w-[48px] overflow-hidden rounded-[24px] transition-all group-hover:rounded-[16px]',
              {
                'rounded-[16px] bg-primary/10 text-primary': isActive,
              },
            )}
          >
            <img className='h-full w-full' src={getImageUrl(imageUrl!)} alt='Channel' />
          </div>
        </button>
      </Link>
    </ActionTooltip>
  );
};

export default NavigationItem;

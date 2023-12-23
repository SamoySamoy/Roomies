import { Plus, Lock, Unlock, EyeOff, Users, PanelTopInactive } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ActionTooltip from '@/components/ActionToolTip';
import ThemeToggle from '@/components/ThemeToggle';
import { cn, getImageUrl } from '@/lib/utils';
import { useModal } from '@/hooks/useModal';
import { Server, ServerType } from '@/lib/types';
import { useParams } from 'react-router-dom';

type Props = {
  servers: Server[];
};

const ServerListSidebar = ({ servers }: Props) => {
  return (
    <div className='flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]'>
      <CreateServerButton />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {servers.map(server => (
          <div key={server.id} className='mb-4'>
            <ServerItem {...server} />
          </div>
        ))}
      </ScrollArea>
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <ThemeToggle />
        <ActionTooltip
          side='right'
          label={<p className='text-sm font-bold text-foreground'>Your profile</p>}
        >
          <Avatar className='duration-400 h-11 w-11 cursor-pointer transition-all hover:scale-110'>
            <AvatarImage src='https://picsum.photos/seed/picsum/100' />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
        </ActionTooltip>
      </div>
    </div>
  );
};

const CreateServerButton = () => {
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
              modalType: 'createServer',
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

const icon = {
  [ServerType.PUBLIC]: <Unlock className='text-emerald-500' />,
  [ServerType.PRIVATE]: <Lock className='text-red-500' />,
  [ServerType.HIDDEN]: <EyeOff className='text-slate-500' />,
};

const ServerItem = ({ id, name, type, imageUrl }: Server) => {
  const { roomId } = useParams<{ roomId: string }>();
  const isActive = roomId === id;
  console.log(getImageUrl(imageUrl!));

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
      <button
        // onClick={onClick}
        className='group relative flex items-center'
      >
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
    </ActionTooltip>
  );
};

export default ServerListSidebar;

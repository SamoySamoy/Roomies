import { Plus, Lock, Unlock, EyeOff, Users, PanelTopInactive } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ActionTooltip from '@/components/ActionToolTip';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

type ServerType = 'public' | 'private' | 'hidden';

type Server = {
  serverId: string | number;
  imageUrl: string;
  serverName: string;
  memberNumber: number;
  channelNumber: number;
  isActive: boolean;
  serverType: ServerType;
};

const servers: Server[] = Array.from({ length: 20 }, (_, index) => ({
  serverId: index + 1,
  imageUrl: 'https://picsum.photos/100',
  serverName: `Server ${index + 1}`,
  memberNumber: Math.floor(Math.random() * 100),
  channelNumber: Math.floor(Math.random() * 10),
  isActive: Math.random() < 0.5, // Randomly set isActive to true or false
  serverType: index % 3 === 0 ? 'hidden' : index % 2 === 0 ? 'private' : 'public',
}));

const RoomSidebar = () => {
  return (
    <div className='space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3'>
      <CreateServerButton />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full'>
        {servers.map((server) => (
          <div key={server.serverId} className='mb-4'>
            <ServerItem {...server} />
          </div>
        ))}
      </ScrollArea>
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <ThemeToggle />
        <ActionTooltip
          side='right'
          labelNode={<p className='text-foreground font-bold text-sm'>Your profile</p>}
        >
          <Avatar className='h-12 w-12 cursor-pointer hover:scale-110 transition-all duration-400'>
            <AvatarImage src='https://picsum.photos/seed/picsum/100' />
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
        </ActionTooltip>
      </div>
    </div>
  );
};

const CreateServerButton = () => {
  return (
    <div>
      <ActionTooltip
        side='right'
        align='center'
        labelNode={<p className='text-sm font-bold'>Add a server</p>}
      >
        <button
          // onClick={() => onOpen('createServer')}
          className='group flex items-center'
        >
          <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus className='group-hover:text-white transition text-emerald-500' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

const ServerTypeIcon = ({ serverType }: { serverType: ServerType }) => {
  const size = 16;
  const strokeWidth = 2;

  switch (serverType) {
    case 'private':
      return <Lock className='text-red-500' size={size} strokeWidth={strokeWidth} />;
    case 'public':
      return <Unlock className='text-emerald-500' size={size} strokeWidth={strokeWidth} />;
    default:
      return <EyeOff className='text-slate-500' size={size} strokeWidth={strokeWidth} />;
  }
};

const ServerItem = ({
  imageUrl,
  serverName,
  channelNumber,
  memberNumber,
  isActive,
  serverType,
}: Server) => {
  return (
    <ActionTooltip
      side='right'
      align='center'
      labelNode={
        <div className='flex items-start gap-2'>
          <div className='flex flex-col flex-1 gap-2'>
            <p className='text-sm font-bold text-foreground'>{serverName}</p>
            <div className='flex gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-xs text-muted-foreground'>{channelNumber}</span>
                <PanelTopInactive size={16} className='stroke-muted-foreground' />
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-xs text-muted-foreground'>{memberNumber}</span>{' '}
                <Users size={16} className='stroke-muted-foreground' />
              </div>
            </div>
          </div>
          <div>
            <ServerTypeIcon serverType={serverType} />
          </div>
        </div>
      }
    >
      <button
        // onClick={onClick}
        className='group relative flex items-center'
      >
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            {
              'group-hover:h-[20px]': !isActive,
            },
            isActive ? 'h-[36px]' : 'h-[8px]',
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            {
              'bg-primary/10 text-primary rounded-[16px]': isActive,
            },
          )}
        >
          <img className='w-full h-full' src={imageUrl} alt='Channel' />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default RoomSidebar;

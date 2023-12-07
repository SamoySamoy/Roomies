import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import ActionTooltip from '@/components/ActionToolTip';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const RoomSidebar = () => {
  return (
    <div className='flex flex-col items-center h-full w-[300px] px-2 py-2 gap-2 text-primary dark:bg-[#1E1F22] bg-[#E3E5E8]'>
      <div className='flex w-full items-center gap-2'>
        <Searchbar />
        <CreateServerButton />
      </div>
      <Separator className='h-[2px] w-full bg-zinc-300 dark:bg-zinc-700 rounded-md' />
      <ScrollArea className='flex-1 w-full'>
        {/* {servers.map(server => (
          <div key={server.id} className='mb-4'>
            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
          </div>
        ))} */}
      </ScrollArea>
    </div>
  );
};

const Searchbar = () => {
  return (
    <div className='flex-1 flex justify-between items-center bg-secondary text-primary px-3 py-4 rounded-md'>
      <div className='font-light text-sm'>Search a server</div>
      <div className='font-light text-sm'>⌘K</div>
    </div>
  );
};

const CreateServerButton = () => {
  return (
    <ActionTooltip side='right' align='center' label='Add a server'>
      <div className='group flex items-center'>
        <div className='flex h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
          <Plus className='group-hover:text-white transition text-emerald-500' size={25} />
        </div>
      </div>
    </ActionTooltip>
  );
};

const ServerItem = () => {
  return (
    <ActionTooltip side='right' align='center' label={''}>
      <button className='group relative flex items-center'>
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-r-full transition-all w-[4px]',
            // params?.serverId !== id && 'group-hover:h-[20px]',
            // params?.serverId === id ? 'h-[36px]' : 'h-[8px]',
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
            // params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]',
          )}
        >
          {/* <Image fill src={imageUrl} alt='Channel' /> */}
        </div>
      </button>
    </ActionTooltip>
  );
};

export default RoomSidebar;

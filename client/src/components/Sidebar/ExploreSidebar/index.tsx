import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ActionTooltip from '@/components/ActionToolTip';
import ThemeToggle from '@/components/ThemeToggle';
import { MyRoomsButton } from './ExploreButton';
import ExploreItem from './ExploreItem';

const ExploreSidebar = () => {
  return (
    <div className='flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]'>
      <MyRoomsButton />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {/* {rooms.map(room => (
          <div key={room.id} className='mb-4'>
            <NavigationItem {...room} />
          </div>
        ))} */}
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

export default ExploreSidebar;

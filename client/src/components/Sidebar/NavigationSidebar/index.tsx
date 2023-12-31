import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { Room } from '@/lib/types';
import { CreateRoomButton, ExploreButton, ProfileButton } from './NavigationButton';
import NavigationItem from './NavigationItem';

type Props = {
  rooms: Room[];
};

const NavigationSidebar = ({ rooms }: Props) => {
  return (
    <div className='flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] py-3 text-primary dark:bg-[#1E1F22]'>
      <ExploreButton />
      <CreateRoomButton />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {rooms.map(room => (
          <div key={room.id} className='mb-4'>
            <NavigationItem {...room} />
          </div>
        ))}
      </ScrollArea>
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <ThemeToggle />
        <ProfileButton />
      </div>
    </div>
  );
};

export default NavigationSidebar;

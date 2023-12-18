import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ServerListSidebar from './RoomListSidebar';
import RoomSidebar from './RoomSidebar';

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0 flex gap-0'>
        <div className='w-[72px]'>
          <ServerListSidebar />
        </div>
        {/* <ChannelListSidebar serverId={serverId} /> */}
        <RoomSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;

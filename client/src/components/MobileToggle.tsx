import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

import NavigationSidebar from './Sidebar/NavigationSidebar';
import RoomSidebar from './Sidebar/RoomSidebar';

const MobileToggle = ({ roomId }: { roomId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0 flex gap-0'>
        <div className='w-[72px]'>
          <NavigationSidebar />
        </div>
        {/* <ChannelListSidebar roomId={roomId} /> */}
        <RoomSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;

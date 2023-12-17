import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ServerListSidebar from './ServerListSidebar';
import ChannelListSidebar from './ChannelListSidebar';

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
        <ChannelListSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;

import { Outlet, useNavigate } from 'react-router-dom';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/RoomSidebar';
import { useEffect } from 'react';

const RoomLayout = () => {
  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex'>
        <RoomListSidebar />
      </div>
      <main className='h-full md:pl-[72px]'>
        <div className='h-full'>
          <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
            <RoomSidebar />
          </div>
          <main className='h-full md:pl-60'>
            <Outlet />
          </main>
        </div>
      </main>
    </div>
  );
};

export default RoomLayout;

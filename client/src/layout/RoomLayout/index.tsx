import { Outlet, useNavigate } from 'react-router-dom';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/Sidebar';
import { useEffect } from 'react';
import { useRoomsJoinedQuery } from '@/hooks/queries';
import { RoomType } from '@/lib/types';

const RoomLayout = () => {
  const { data } = useRoomsJoinedQuery({
    groups: true,
    members: true,
    profile: true,
  });
  console.log(data);

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

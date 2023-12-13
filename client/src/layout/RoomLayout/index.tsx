import { Outlet } from 'react-router-dom';
import RoomSidebar from './RoomSidebar';

const RoomLayout = () => {
  return (
    <div className='h-full'>
      <div className='hidden md:flex flex-col h-full w-[72px] z-30 fixed inset-y-0'>
        <RoomSidebar />
      </div>
      <main className='md:pl-[72px] h-full'>
        <Outlet />
      </main>
    </div>
  );
};

export default RoomLayout;

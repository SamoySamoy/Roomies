import { Outlet } from 'react-router-dom';
import RoomSidebar from './RoomSidebar';

const RoomLayout = () => {
  return (
    <div className='flex h-full '>
      <div className='w-[200]x] h-full'>
        <RoomSidebar />
      </div>
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default RoomLayout;

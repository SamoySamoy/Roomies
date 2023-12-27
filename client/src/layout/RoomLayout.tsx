import LoadingOverlay from '@/components/LoadingOverlay';
import RoomListSidebar from '@/components/Sidebar/NavigationSidebar';
import RoomSidebar from '@/components/Sidebar/RoomSidebar';
import { useRoomQuery, useRoomsQuery } from '@/hooks/queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

const RoomLayout = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const {
    data: room,
    isPending,
    isFetching,
    isRefetching,
    isError,
  } = useRoomQuery(roomId!, {
    groups: true,
    members: true,
  });

  if (isPending || isFetching || isRefetching) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <RoomSidebar room={room} />
      </div>
      <main className='h-full md:pl-60'>
        <Outlet />
      </main>
    </div>
  );
};

export default RoomLayout;

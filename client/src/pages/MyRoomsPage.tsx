import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import RoomListSidebar from '@/components/Sidebar/NavigationSidebar';
import RoomSidebar from '@/components/Sidebar/RoomSidebar';
import { useEffect } from 'react';
import { useRoomsQuery } from '@/hooks/queries';
import { RoomType } from '@/lib/types';
import LoadingOverlay from '@/components/LoadingOverlay';

const MyRoomsPage = () => {
  const {
    data: rooms,
    isPending,
    isFetching,
    isRefetching,
    isError,
  } = useRoomsQuery({
    roomType: 'all',
    status: 'joined',
  });

  if (isPending || isFetching || isRefetching) {
    console.log('Loading');
  }
  console.log(rooms);

  if (isPending || isFetching || isRefetching) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} />;
  }

  if (rooms.length === 0) {
    return <Navigate to={'/first-room'} replace />;
  }

  return <Navigate to={`/rooms/${rooms[0].id}`} replace />;
};

export default MyRoomsPage;

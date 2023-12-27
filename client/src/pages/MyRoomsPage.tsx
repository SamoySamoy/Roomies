import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/Sidebar';
import { useEffect } from 'react';
import { useRoomsJoinedQuery } from '@/hooks/queries';
import { RoomType } from '@/lib/types';
import LoadingOverlay from '@/components/LoadingOverlay';

const MyRoomsPage = () => {
  const { data: rooms, isPending, isError } = useRoomsJoinedQuery({});

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  if (rooms.length === 0) {
    return <Navigate to={'/first-room'} replace />;
  }

  return <Navigate to={`/rooms/${rooms[0].id}`} />;
};

export default MyRoomsPage;

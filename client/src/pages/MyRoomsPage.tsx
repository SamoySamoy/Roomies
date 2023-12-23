import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/RoomSidebar';
import { useEffect } from 'react';
import { useServersJoinedQuery } from '@/hooks/queries';
import { ServerType } from '@/lib/types';
import LoadingOverlay from '@/components/LoadingOverlay';

const MyRoomsPage = () => {
  const { data: servers, isPending, isError } = useServersJoinedQuery({});

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  if (servers.length === 0) {
    return <Navigate to={'/first-room'} replace />;
  }

  return <Navigate to={`/rooms/${servers[0].id}`} />;
};

export default MyRoomsPage;

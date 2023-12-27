import LoadingOverlay from '@/components/LoadingOverlay';
import RoomListSidebar from '@/components/Sidebar/NavigationSidebar';
import RoomSidebar from '@/components/Sidebar/RoomSidebar';
import { useRoomQuery } from '@/hooks/queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

const RoomRedirectPage = () => {
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

  const initialGroup = room.groups.find(group => group.name === 'default');

  return <Navigate to={`/rooms/${roomId}/groups/${initialGroup!.id}`} replace />;
};

export default RoomRedirectPage;

import LoadingOverlay from '@/components/LoadingOverlay';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/Sidebar';
import { useGroupsOfRoomQuery } from '@/hooks/queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

const RoomRedirectPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const {
    data: groups,
    isPending,
    isError,
  } = useGroupsOfRoomQuery({
    roomId,
  });

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  console.log(groups);

  const initialChannel = groups.find(channel => channel.name === 'general');

  return <Navigate to={`/rooms/${roomId}/groups/${initialChannel!.id}`} replace />;
};

export default RoomRedirectPage;

import LoadingOverlay from '@/components/LoadingOverlay';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/RoomSidebar';
import { useChannelsOfServer, useServersJoinedQuery } from '@/hooks/queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

const RoomRedirectPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const {
    data: channels,
    isPending,
    isError,
  } = useChannelsOfServer({
    serverId: roomId,
  });

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  console.log(channels);

  const initialChannel = channels.find(channel => channel.name === 'general');

  return <Navigate to={`/rooms/${roomId}/groups/${initialChannel!.id}`} replace />;
};

export default RoomRedirectPage;

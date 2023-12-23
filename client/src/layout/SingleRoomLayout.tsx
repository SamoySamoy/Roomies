import LoadingOverlay from '@/components/LoadingOverlay';
import RoomListSidebar from '@/components/RoomListSidebar';
import RoomSidebar from '@/components/RoomSidebar';
import { useChannelsOfServer, useServersJoinedQuery } from '@/hooks/queries';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';

const SingleRoomLayout = () => {
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

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0'>
        <RoomSidebar channels={channels} />
      </div>
      <main className='h-full md:pl-60'>
        <Outlet />
      </main>
    </div>
  );
};

export default SingleRoomLayout;

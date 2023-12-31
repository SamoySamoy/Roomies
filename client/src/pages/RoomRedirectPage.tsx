import { LoadingPage } from '@/components/Loading';
import { useRoomQuery } from '@/hooks/queries';
import { useParams, Navigate } from 'react-router-dom';

const RoomRedirectPage = () => {
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
    profilesOfMembers: true,
  });

  console.log('In room redirect page');

  if (isPending || isFetching || isRefetching) {
    return <LoadingPage />;
  }

  if (isError || !room) {
    return <Navigate to={'/error-page'} replace />;
  }

  const initialGroup = room.groups.find(group => group.name === 'default');

  return <Navigate to={`/rooms/${roomId}/groups/${initialGroup!.id}`} replace />;
};

export default RoomRedirectPage;

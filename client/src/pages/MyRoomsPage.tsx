import { Navigate } from 'react-router-dom';
import { useRoomsQuery } from '@/hooks/queries';
import { LoadingPage } from '@/components/Loading';

const MyRoomsPage = () => {
  const {
    data: rooms,
    isPending,
    isFetching,
    isError,
  } = useRoomsQuery(
    {
      roomType: 'all',
      status: 'joined',
    },
    {
      refetchOnMount: true,
    },
  );

  if (isPending || isFetching) {
    return <LoadingPage />;
  }

  if (isError || !rooms) {
    return <Navigate to={'/error-page'} />;
  }

  if (rooms.length === 0) {
    return <Navigate to={'/first-room'} replace />;
  }

  return <Navigate to={`/rooms/${rooms[0].id}`} replace />;
};

export default MyRoomsPage;

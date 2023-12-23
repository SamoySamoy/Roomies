import LoadingOverlay from '@/components/LoadingOverlay';
import RoomListSidebar from '@/components/RoomListSidebar';
import { useServersJoinedQuery } from '@/hooks/queries';
import { Outlet, Navigate } from 'react-router-dom';

const RoomListLayout = () => {
  const { data: servers, isPending, isError } = useServersJoinedQuery({});

  if (isPending) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex'>
        <RoomListSidebar servers={servers} />
      </div>
      <main className='h-full md:pl-[72px]'>
        <Outlet />
      </main>
    </div>
  );
};

export default RoomListLayout;

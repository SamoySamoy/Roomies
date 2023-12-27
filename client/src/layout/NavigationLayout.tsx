import LoadingOverlay from '@/components/LoadingOverlay';
import NavigationSidebar from '@/components/Sidebar/NavigationSidebar';
import { useRoomsQuery } from '@/hooks/queries';
import { Outlet, Navigate } from 'react-router-dom';

const NavigationLayout = () => {
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
    return <LoadingOverlay />;
  }

  if (isError) {
    return <Navigate to={'/error'} replace />;
  }

  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-30 hidden h-full w-[72px] flex-col md:flex'>
        <NavigationSidebar rooms={rooms} />
      </div>
      <main className='h-full md:pl-[72px]'>
        <Outlet />
      </main>
    </div>
  );
};

export default NavigationLayout;

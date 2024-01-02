import { LoadingPage } from '@/components/Loading';
import NavigationSidebar from '@/components/Sidebar/NavigationSidebar';
import { useRoomsQuery } from '@/hooks/queries';
import { Outlet, Navigate } from 'react-router-dom';

const NavigationLayout = () => {
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
      // refetchOnMount: true,
    },
  );

  console.log('In navigation layout');

  if (isPending || isFetching) {
    return <LoadingPage />;
  }

  if (isError || !rooms) {
    return <Navigate to={'/error-page'} />;
  }

  if (rooms.length === 0) {
    return <Navigate to={'/first-room'} replace />;
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

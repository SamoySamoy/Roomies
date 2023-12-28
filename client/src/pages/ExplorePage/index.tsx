import { useRoomsQuery } from '@/hooks/queries';
import Featured from './Featured';
import Search from './Search';
import { LoadingPage } from '@/components/Loading';
import { Navigate } from 'react-router-dom';

const ExplorePage = () => {
  const {
    data: rooms,
    isPending,
    isFetching,
    isRefetching,
    isError,
  } = useRoomsQuery(
    {
      roomType: 'viewable',
      status: 'all',
      groups: true,
      members: true,
      profile: true,
      profilesOfMembers: false,
    },
    {
      refetchOnMount: true,
    },
  );

  if (isPending || isFetching || isRefetching) {
    return <LoadingPage />;
  }

  if (isError) {
    return <Navigate to={'/error-page'} replace />;
  }

  return (
    <div className='bg-white dark:bg-[#313338] w-full min-h-full px-4 py-2'>
      <Search />
      <Featured rooms={rooms} />
    </div>
  );
};

export default ExplorePage;

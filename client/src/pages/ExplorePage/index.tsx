import { useRoomsQuery } from '@/hooks/queries';
import Featured from './Featured';
import Search from './Search';
import { LoadingPage } from '@/components/Loading';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';

const ExplorePage = () => {
  const {
    data: rooms,
    isPending,
    isFetching,
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
  
  const [query, setQuery] = useState('');
  const filterdRoom = rooms?.filter(room => {
    if (query.length === 0) return true;
    return room.name.split(' ').some(word => {
      return word.toLowerCase().startsWith(query);
    });
  });

  function handleChane(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }
  
  if (isPending || isFetching) {
    return <LoadingPage />;
  }

  if (isError) {
    return <Navigate to={'/error-page'} replace />;
  }

  return (
    <div className='bg-white dark:bg-[#313338] w-full min-h-full px-4 py-2'>
      <Search query={query} onChange={handleChane} />
      <Featured rooms={filterdRoom} />
    </div>
  );
};

export default ExplorePage;

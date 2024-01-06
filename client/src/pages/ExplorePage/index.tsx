import { useRoomsQuery } from '@/hooks/queries';
import Featured from './Featured';
import Search from './Search';
import { LoadingPage } from '@/components/Loading';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { normalizeStr } from '@/lib/utils';

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
      select: data => {
        if (!query) return data;

        const filteredData = data.filter(room => {
          const normalizedSearch = normalizeStr(query);
          const isNameConform = normalizeStr(room.name).includes(normalizedSearch);
          const isTypeConform = normalizeStr(room.type).includes(normalizedSearch);
          // const is
        });

        return filteredData;
      },
    },
  );

  const [query, setQuery] = useState('');
  //Tìm xem trong room name có chứa một từ trong query hay không
  const filterdRoom = rooms?.filter(room => {
    if (query.length === 0) return true;
    return query.split(' ').every(queryWord => {
      if (queryWord.length === 0) return false;
      return room.name.includes(queryWord);
      // return room.name.split(' ').some(word => {
      //   if (queryWord.length === 0) return false;
      //   return word.toLowerCase().includes(queryWord);
      // });
    })
    
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

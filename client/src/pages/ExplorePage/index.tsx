import { useRoomsQuery } from '@/hooks/queries';
import Featured from './Featured';
import Search from './Search';
import { LoadingPage } from '@/components/Loading';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { cn, normalizeStr } from '@/lib/utils';

const ExplorePage = () => {
  const [search, setSearch] = useState('');
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
        if (!search) return data;
        if (!data) return data;

        // Filter function 1
        // const filteredData = data.filter(room => {
        //   if (search.length === 0) return true;
        //   return search.split(' ').some(queryWord => {
        //     if (queryWord.length === 0) return false;
        //     return room.name.includes(queryWord);
        //   });
        // });

        // Filter function 2
        const filteredData = data.filter(room => {
          const normalizedSearch = normalizeStr(search);
          const isNameConform = normalizeStr(room.name).includes(normalizedSearch);
          const isTypeConform = normalizeStr(room.type).includes(normalizedSearch);
          const isIdConform =
            normalizeStr(room.id).includes(normalizedSearch) ||
            normalizeStr(room.profileId).includes(normalizedSearch);
          const isInviteCodeConform = normalizeStr(room.inviteCode).includes(normalizedSearch);
          const isEmailConform = normalizeStr(room.profile.email).includes(normalizedSearch);

          return (
            isNameConform || isTypeConform || isIdConform || isInviteCodeConform || isEmailConform
          );
        });

        return filteredData;
      },
    },
  );

  if (isPending || isFetching) {
    return <LoadingPage />;
  }

  if (isError) {
    return <Navigate to={'/error-page'} replace />;
  }

  return (
    <div
      className={cn('bg-white dark:bg-[#313338] w-full min-h-full px-4 py-2', {
        'flex flex-col': rooms.length === 0,
      })}
    >
      <Search search={search} onChange={e => setSearch(e.target.value)} />
      <Featured rooms={rooms} />
    </div>
  );
};

export default ExplorePage;

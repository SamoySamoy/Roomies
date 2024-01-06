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
        if (!normalizeStr(search)) return data;
        if (!data || data.length === 0) return data;

        const isIncluded = (target: string, search: string, some: boolean = false) => {
          const normalizedTarget = normalizeStr(target);
          const normalizedSearch = normalizeStr(search);

          if (some) {
            return normalizedSearch.split(' ').some(searchWord => {
              if (searchWord.length === 0) return false;
              return normalizedTarget.includes(searchWord);
            });
          } else {
            return normalizedSearch.split(' ').every(searchWord => {
              if (searchWord.length === 0) return false;
              return normalizedTarget.includes(searchWord);
            });
          }
        };

        const filteredData = data.filter(room => {
          const isNameConform = isIncluded(room.name, search, true);
          const isTypeConform = isIncluded(room.type, search);
          // const isIdConform = isIncluded(room.id, search) || isIncluded(room.profileId, search);
          const isInviteCodeConform = isIncluded(room.inviteCode, search);
          const isEmailConform = isIncluded(room.profile.email, search);

          return isNameConform || isTypeConform || isInviteCodeConform || isEmailConform;
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

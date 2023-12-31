import { useQuery, useInfiniteQuery, UndefinedInitialDataOptions } from '@tanstack/react-query';

import useApi from './useApi';
import { Group, Member, Message, Room, RoomType } from '@/lib/types';
import { getQueryString } from '@/lib/utils';

export const queryKeyFactory = {
  rooms: (keys: any[]) => ['rooms', ...keys],
  room: (roomId: string, keys: any[]) => ['room', 'roomId', roomId, ...keys],
  groups: (roomdId: string, keys: any[]) => ['groups', 'roomId', roomdId, ...keys],
  group: (groupId: string, keys: any[]) => ['group', 'groupId', groupId, ...keys],
  members: (roomdId: string, keys: any[]) => ['members', 'roomId', roomdId, ...keys],
  member: (memberId: string, keys: any[]) => ['member', 'memberId', memberId, ...keys],
  messages: (groupId: string) => ['messages', groupId],
} as const;

export type RoomQueryInclude = {
  profile: boolean;
  members: boolean;
  groups: boolean;
  profilesOfMembers: boolean;
};

export type RoomQueryFilter = {
  status: 'created' | 'joined' | 'all';
  roomType: RoomType | 'viewable' | 'all';
};

export type QueryOptions<T> = Omit<UndefinedInitialDataOptions<T>, 'queryKey' | 'queryFn'>;

export function useRoomsQuery<T = Room[]>(
  args?: Partial<RoomQueryInclude & RoomQueryFilter>,
  options?: QueryOptions<T>,
) {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<T>({
    queryKey: queryKeyFactory.rooms(queryValues),
    queryFn: async () => {
      const res = await api.get<T>(`/rooms${queryString}`);
      return res.data;
    },
    ...options,
  });
}

export function useRoomQuery<T = Room>(
  roomId: string,
  args?: Partial<RoomQueryInclude>,
  options?: QueryOptions<T>,
) {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<T>({
    queryKey: queryKeyFactory.room(roomId, queryValues),
    queryFn: async () => {
      const res = await api.get<T>(`/rooms/${roomId}${queryString}`);
      return res.data;
    },
    ...options,
  });
}

export type GroupQueryInclude = {
  messages: boolean;
  profile: boolean;
};

export function useGroupsQuery<T = Group[]>(
  roomId: string,
  args?: Partial<GroupQueryInclude>,
  options?: QueryOptions<T>,
) {
  const { queryString, queryValues } = getQueryString({ ...args, roomId });
  const api = useApi();

  return useQuery<T>({
    queryKey: queryKeyFactory.groups(roomId, queryValues),
    queryFn: async () => {
      const res = await api.get<T>(`/groups/${queryString}`);
      return res.data;
    },
    ...options,
  });
}

export function useGroupQuery<T = Group>(
  groupId: string,
  args?: Partial<GroupQueryInclude>,
  options?: QueryOptions<T>,
) {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<T>({
    queryKey: queryKeyFactory.group(groupId, queryValues),
    queryFn: async () => {
      const res = await api.get<T>(`/groups/${groupId}${queryString}`);
      return res.data;
    },
    ...options,
  });
}

export type MemberQueryInclude = {
  profile: boolean;
};

export function useMembersQuery<T = Member[]>(
  roomId: string,
  args?: Partial<MemberQueryInclude>,
  options?: QueryOptions<T>,
) {
  const { queryString, queryValues } = getQueryString({ ...args, roomId });
  const api = useApi();

  return useQuery<T>({
    queryKey: queryKeyFactory.members(roomId, queryValues),
    queryFn: async () => {
      const res = await api.get<T>(`/members${queryString}`);
      return res.data;
    },
    ...options,
  });
}

export type CursorResult = {
  messages: Message[];
  lastCursor: string | null;
};

export function useMessagesInfiniteQuery(groupId: string) {
  const api = useApi();

  return useInfiniteQuery<CursorResult>({
    queryKey: queryKeyFactory.messages(groupId),
    queryFn: async ({ pageParam = undefined }) => {
      const { queryString } = getQueryString({
        groupId,
        cursor: pageParam,
      });
      const res = await api.get<CursorResult>(`/messages${queryString}`);
      return res.data;
    },
    initialPageParam: '',
    getNextPageParam: lastPage => lastPage.lastCursor,
    refetchOnMount: true,
  });
}

import { useQuery, UndefinedInitialDataOptions } from '@tanstack/react-query';

import useApi from './useApi';
import { Group, Member, Room, RoomType } from '@/lib/types';
import { getQueryString } from '@/lib/utils';

export const queryKeyFactory = {
  rooms: (keys: any[]) => ['rooms', ...keys],
  room: (roomId: string, keys: any[]) => ['room', 'roomId', roomId, ...keys],
  groups: (roomdId: string, keys: any[]) => ['groups', 'roomId', roomdId, ...keys],
  group: (groupId: string, keys: any[]) => ['group', 'groupId', groupId, ...keys],
  members: (roomdId: string, keys: any[]) => ['members', 'roomId', roomdId, ...keys],
  member: (memberId: string, keys: any[]) => ['member', 'memberId', memberId, ...keys],
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

export const useRoomsQuery = (
  args?: Partial<RoomQueryInclude & RoomQueryFilter>,
  options?: Omit<UndefinedInitialDataOptions<Room[]>, 'queryKey' | 'queryFn'>,
) => {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<Room[]>({
    queryKey: queryKeyFactory.rooms(queryValues),
    queryFn: async () => {
      const res = await api.get<Room[]>(`/rooms${queryString}`);
      return res.data;
    },
    ...options,
  });
};

export const useRoomQuery = (roomId: string, args?: Partial<RoomQueryInclude>) => {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<Room>({
    queryKey: queryKeyFactory.room(roomId, queryValues),
    queryFn: async () => {
      const res = await api.get<Room>(`/rooms/${roomId}${queryString}`);
      return res.data;
    },
  });
};

export type GroupQueryInclude = {
  messages: boolean;
  profile: boolean;
};

export const useGroupsQuery = (roomId: string, args?: Partial<GroupQueryInclude>) => {
  const { queryString, queryValues } = getQueryString({ ...args, roomId });
  const api = useApi();

  return useQuery<Group[]>({
    queryKey: queryKeyFactory.groups(roomId, queryValues),
    queryFn: async () => {
      const res = await api.get<Group[]>(`/groups/${queryString}`);
      return res.data;
    },
  });
};

export const useGroupQuery = (groupId: string, args?: Partial<GroupQueryInclude>) => {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<Group>({
    queryKey: queryKeyFactory.group(groupId, queryValues),
    queryFn: async () => {
      const res = await api.get<Group>(`/groups/${groupId}${queryString}`);
      return res.data;
    },
  });
};

export type MemberQueryInclude = {
  profile: boolean;
};

export const useMembersQuery = (roomId: string, args?: Partial<MemberQueryInclude>) => {
  const { queryString, queryValues } = getQueryString({ ...args, roomId });
  const api = useApi();

  return useQuery<Member[]>({
    queryKey: queryKeyFactory.members(roomId, queryValues),
    queryFn: async () => {
      const res = await api.get<Member[]>(`/members${queryString}`);
      return res.data;
    },
    throwOnError: true,
  });
};

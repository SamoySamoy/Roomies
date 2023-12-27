import { useQuery } from '@tanstack/react-query';

import useApi from './useApi';
import { Group, Room, RoomType } from '@/lib/types';
import { getQueryString } from '@/lib/utils';

export const queryKeyFactory = {
  rooms: (keys: any[]) => ['rooms', ...keys],
  room: (roomId: string, keys: any[]) => ['room', roomId, ...keys],
  group: (groupId: string, keys: any[]) => ['group', groupId, ...keys],
} as const;

export type RoomQueryInclude = {
  profile: boolean;
  members: boolean;
  groups: boolean;
};

export type RoomQueryFilter = {
  status: 'created' | 'joined' | 'all';
  roomType: RoomType | 'viewable' | 'all';
};

export const useRoomsQuery = (args?: Partial<RoomQueryInclude & RoomQueryFilter>) => {
  const { queryString, queryValues } = getQueryString(args);
  const api = useApi();

  return useQuery<Room[]>({
    queryKey: queryKeyFactory.rooms(queryValues),
    queryFn: async () => {
      const res = await api.get<Room[]>(`/rooms${queryString}`);
      return res.data;
    },
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
  messages: string;
  profile: string;
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

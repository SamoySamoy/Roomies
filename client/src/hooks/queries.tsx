import qs from 'query-string';
import { useQuery } from '@tanstack/react-query';
import { Room, Group } from '@/lib/types';
import useApi from './useApi';

export const queryKeyFactory = {
  roomsJoined: ['rooms', 'joined'],
  groupsOfRoom: (roomId: string) => ['room', roomId, 'groups'],
} as const;

export type RoomQueryFilter = {
  profile: boolean;
  members: boolean;
  groups: boolean;
};

export const useRoomsJoinedQuery = ({
  profile = false,
  members = false,
  groups = false,
}: Partial<RoomQueryFilter>) => {
  const api = useApi();
  const query = useQuery({
    queryKey: queryKeyFactory.roomsJoined,
    queryFn: async () => {
      let query = '?' + qs.stringify({ profile, members, groups });
      const res = await api.get<Room[]>(`/rooms${query}`);
      return res.data;
    },
  });
  return query;
};

type GroupQueryFilter = {
  messages: boolean;
  roomId: string;
};

export const useGroupsOfRoomQuery = ({
  roomId = '',
  messages = false,
}: Partial<GroupQueryFilter>) => {
  const api = useApi();
  const query = useQuery({
    queryKey: queryKeyFactory.groupsOfRoom(roomId),
    queryFn: async () => {
      let query = '?' + qs.stringify({ messages, roomId });
      const res = await api.get<Group[]>(`/groups${query}`);
      return res.data;
    },
  });
  return query;
};

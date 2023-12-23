import qs from 'query-string';
import { useQuery } from '@tanstack/react-query';
import { Server, Channel } from '@/lib/types';
import useApi from './useApi';

export const queryKeyFactory = {
  serversJoined: ['servers', 'joined'],
  channelsOfServer: (serverId: string) => ['server', serverId, 'channels'],
} as const;

export type ServerQueryFilter = {
  profile: boolean;
  members: boolean;
  channels: boolean;
};

export const useServersJoinedQuery = ({
  profile = false,
  members = false,
  channels = false,
}: Partial<ServerQueryFilter>) => {
  const api = useApi();
  const query = useQuery({
    queryKey: queryKeyFactory.serversJoined,
    queryFn: async () => {
      let query = '?' + qs.stringify({ profile, members, channels });
      const res = await api.get<Server[]>(`/servers${query}`);
      return res.data;
    },
  });
  return query;
};

type ChannelQueryFilter = {
  messages: boolean;
  serverId: string;
};

export const useChannelsOfServer = ({
  serverId = '',
  messages = false,
}: Partial<ChannelQueryFilter>) => {
  const api = useApi();
  const query = useQuery({
    queryKey: queryKeyFactory.channelsOfServer(serverId),
    queryFn: async () => {
      let query = '?' + qs.stringify({ messages, serverId });
      const res = await api.get<Channel[]>(`/channels${query}`);
      return res.data;
    },
  });
  return query;
};

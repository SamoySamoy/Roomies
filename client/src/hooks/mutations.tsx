import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateChannelSchema, JoinServerSchema, LoginSchema } from './forms';
import { useAuth } from './useAuth';
import { Channel, Profile, Server } from '@/lib/types';
import useApi from './useApi';
import { queryKeyFactory } from './queries';

export const useLoginMutation = () => {
  const { setAuth } = useAuth();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await api.post<{ accessToken: string }>('/auth/login', data);
      return res.data;
    },
    onSuccess: data => {
      console.log(data.accessToken);
    },
    onError: () => {
      setAuth(undefined);
    },
  });
  return mutation;
};
export const useRegisterMutation = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await api.post<Profile>('/auth/register', data);
      return res.data;
    },
  });
  return mutation;
};

export const useCreateServerMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post<Server>('/servers', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

export const useLeaveServerMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.post<Server>(`/servers/leave/${roomId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

export const useJoinServerMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (data: JoinServerSchema) => {
      const res = await api.post<Server>(`/servers/join/${data.serverId}`, {
        serverPassword: data.serverPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

export const useInviteServerMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ inviteCode }: { inviteCode: string }) => {
      const res = await api.post<Server>(`/servers/join/invite/${inviteCode}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

export const useUpdateServerMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ data, roomId }: { data: FormData; roomId: string }) => {
      const res = await api.put<Server>(`/servers/${roomId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

export const useDeleteServerMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.delete(`/servers/${roomId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

export const useCreateChannelMutation = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (
      data: CreateChannelSchema & {
        serverId: string;
      },
    ) => {
      const res = await api.post<Server>('/channels', data);
      return res.data;
    },
  });
  return mutation;
};

export const useUpdateChannelMutation = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({
      channelId,
      ...otherData
    }: CreateChannelSchema & {
      channelId: string;
    }) => {
      const res = await api.put<Server>(`/channels/${channelId}`, otherData);
      return res.data;
    },
  });
  return mutation;
};

export const useDeleteChannelMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ channelId }: { channelId: string }) => {
      const res = await api.delete(`/channels/${channelId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.serversJoined,
      });
    },
  });
  return mutation;
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateGroupSchema, JoinRoomSchema, LoginSchema } from './forms';
import { useAuth } from './useAuth';
import { Profile, Room } from '@/lib/types';
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

export const useCreateRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post<Room>('/rooms', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

export const useLeaveRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.post<Room>(`/rooms/leave/${roomId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

export const useJoinRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (data: JoinRoomSchema) => {
      const res = await api.post<Room>(`/rooms/join/${data.roomId}`, {
        roomPassword: data.roomPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

export const useInviteRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ inviteCode }: { inviteCode: string }) => {
      const res = await api.post<Room>(`/rooms/join/invite/${inviteCode}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ data, roomId }: { data: FormData; roomId: string }) => {
      const res = await api.put<Room>(`/rooms/${roomId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.delete(`/rooms/${roomId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

export const useCreateGroupMutation = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async (
      data: CreateGroupSchema & {
        roomId: string;
      },
    ) => {
      const res = await api.post<Room>('/groups', data);
      return res.data;
    },
  });
  return mutation;
};

export const useUpdateGroupMutation = () => {
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({
      groupId,
      ...otherData
    }: CreateGroupSchema & {
      groupId: string;
    }) => {
      const res = await api.put<Room>(`/groups/${groupId}`, otherData);
      return res.data;
    },
  });
  return mutation;
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  const mutation = useMutation({
    mutationFn: async ({ groupId }: { groupId: string }) => {
      const res = await api.delete(`/groups/${groupId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.roomsJoined,
      });
    },
  });
  return mutation;
};

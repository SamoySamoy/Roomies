import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateGroupSchema, JoinRoomSchema, LoginSchema } from './forms';
import { useAuth } from './useAuth';
import { Profile, Room } from '@/lib/types';
import useApi from './useApi';
import { queryKeyFactory } from './queries';

export const useLoginMutation = () => {
  const { setAuth } = useAuth();
  const api = useApi();
  return useMutation({
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
};
export const useRegisterMutation = () => {
  const api = useApi();
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await api.post<Profile>('/auth/register', data);
      return res.data;
    },
  });
};

export const useCreateRoomMutation = (args?: { refetch: boolean }) => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post<Room>('/rooms', data);
      return res.data;
    },
    onSuccess: () => {
      if (args?.refetch) {
        return queryClient.refetchQueries({
          queryKey: queryKeyFactory.rooms([]),
        });
      }
      return queryClient.invalidateQueries({
        queryKey: queryKeyFactory.rooms([]),
      });
    },
  });
};

export const useLeaveRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.post<Room>(`/rooms/leave/${roomId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.rooms([]),
      });
    },
  });
};

export const useJoinRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async (data: JoinRoomSchema) => {
      const res = await api.post<Room>(`/rooms/join/${data.roomId}`, {
        roomPassword: data.roomPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.rooms([]),
      });
    },
  });
};

export const useInviteRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ inviteCode }: { inviteCode: string }) => {
      const res = await api.post<Room>(`/rooms/join/invite/${inviteCode}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.rooms([]),
      });
    },
  });
};

export const useUpdateRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ data, roomId }: { data: FormData; roomId: string }) => {
      const res = await api.put<Room>(`/rooms/${roomId}`, data);
      return res.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.room(roomId, []),
      });
    },
  });
};

export const useDeleteRoomMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.delete(`/rooms/${roomId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.rooms([]),
      });
    },
  });
};

export const useCreateGroupMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async (
      data: CreateGroupSchema & {
        roomId: string;
      },
    ) => {
      const res = await api.post<Room>('/groups', data);
      return res.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.room(roomId, []),
      });
    },
  });
};

export const useUpdateGroupMutation = () => {
  const api = useApi();
  return useMutation({
    mutationFn: async ({
      groupId,
      ...otherData
    }: CreateGroupSchema & {
      groupId: string;
    }) => {
      const res = await api.put<Room>(`/groups/${groupId}`, otherData);
      return res.data;
    },
    // onSuccess: (_, { roomId }) => {
    //   queryClient.invalidateQueries({
    //     queryKey: queryKeyFactory.room(roomId, []),
    //   });
    // },
  });
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ groupId }: { groupId: string }) => {
      const res = await api.delete(`/groups/${groupId}`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.rooms([]),
      });
    },
  });
};

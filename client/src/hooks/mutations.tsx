import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChangeProfilePasswordSchema,
  CreateGroupSchema,
  ForgotSchema,
  JoinRoomByInviteCodeSchema,
  JoinRoomSchema,
  LoginSchema,
  ResetSchema,
} from './forms';
import { useAuth } from './useAuth';
import { MemberRole, Room } from '@/lib/types';
import useApi from './useApi';
import { queryKeyFactory } from './queries';
import { getQueryString } from '@/lib/utils';

export const useLoginMutation = () => {
  const { setAuth } = useAuth();
  const api = useApi();
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const res = await api.post<{ accessToken: string }>('/auth/login', data);
      return res.data;
    },
    onSuccess: data => {
      // console.log(data.accessToken);
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
      const res = await api.post('/auth/register', data);
      return res;
    },
  });
};
export const useForgotMutation = () => {
  const api = useApi();
  return useMutation({
    mutationFn: async (data: ForgotSchema) => {
      const res = await api.post('/auth/forgot', data);
      return res.data;
    },
  });
};
export const useResetMutation = () => {
  const api = useApi();
  return useMutation({
    mutationFn: async ({
      token,
      password,
    }: ResetSchema & {
      token: string;
    }) => {
      const res = await api.post(`/auth/reset/${token}`, { password });
      return res;
    },
  });
};
export const useLogoutMutation = () => {
  const { setAuth } = useAuth();
  const api = useApi();

  return useMutation({
    mutationFn: async () => {
      await api.get('/auth/logout');
    },
    onSuccess: () => {
      setAuth(undefined);
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

export const useLeaveRoomMutation = (args?: { refetch: boolean }) => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.post<Room>(`/rooms/leave/${roomId}`);
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

export const useJoinRoomMutation = (args?: { refetch: boolean }) => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async (data: JoinRoomSchema) => {
      const res = await api.post<Room | null>(`/rooms/join/${data.roomId}`, {
        roomPassword: data.roomPassword,
      });
      // 204 means already join room
      return res.data || res.status === 204;
    },
    onSuccess: data => {
      if (typeof data == 'boolean') return;

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

export const useJoinRoomByInviteCodeMutation = (args?: { refetch: boolean }) => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ inviteCode }: JoinRoomByInviteCodeSchema) => {
      const res = await api.post<Room | null>(`/rooms/join/invite/${inviteCode}`);
      // 204 means already join room
      return res.data || res.status === 204;
    },
    onSuccess: data => {
      if (typeof data == 'boolean' && data == true) return;

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

export const useDeleteRoomMutation = (args?: { refetch: boolean }) => {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: async ({ roomId }: { roomId: string }) => {
      const res = await api.delete(`/rooms/${roomId}`);
      return res;
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
    // onError(err) {
    //   if (err instanceof AxiosError) {
    //     console.log(err);
    //   }
    // },
  });
};

export const useUpdateGroupMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      groupId,
      roomId,
      ...otherData
    }: CreateGroupSchema & {
      groupId: string;
      roomId: string;
    }) => {
      const res = await api.put<Room>(`/groups/${groupId}`, otherData);
      return res.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.room(roomId, []),
      });
    },
  });
};

export const useDeleteGroupMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ groupId }: { groupId: string; roomId: string }) => {
      const res = await api.delete(`/groups/${groupId}`);
      return res;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.room(roomId, []),
      });
    },
  });
};

export const useChangeRoleMemberMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      roomId,
      memberId,
      role,
    }: {
      roomId: string;
      memberId: string;
      role: MemberRole;
    }) => {
      const { queryString } = getQueryString({ roomId });
      const res = await api.put(`/members/${memberId}${queryString}`, {
        role,
      });
      return res;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.room(roomId, []),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.members(roomId, []),
      });
    },
  });
};

export const useKickMemberMutation = () => {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ roomId, memberId }: { roomId: string; memberId: string }) => {
      const { queryString } = getQueryString({ roomId });
      const res = await api.delete(`/members/${memberId}${queryString}`);
      return res.data;
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.room(roomId, []),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactory.members(roomId, []),
      });
    },
  });
};

export const useChangeProfilePasswordMutation = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async (data: ChangeProfilePasswordSchema) => {
      const res = await api.put('/profiles/changePassword', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res;
    },
  });
};

export type UpdatedInfo = {
  email: string;
  imageUrl: string | null;
};

export const useUploadProfileImageMutation = () => {
  const api = useApi();
  const { setInfo } = useAuth();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.put<UpdatedInfo>('/profiles/image', data);
      return res.data;
    },
    onSuccess: data => {
      setInfo({
        email: data.email,
        imageUrl: data.imageUrl || undefined,
      });
    },
  });
};

export const useDeleteProfileImageMutation = () => {
  const api = useApi();
  const { setInfo } = useAuth();

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete<UpdatedInfo>('/profiles/image');
      return res.data;
    },
    onSuccess: data => {
      setInfo({
        email: data.email,
        imageUrl: data.imageUrl || undefined,
      });
    },
  });
};

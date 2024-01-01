import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GroupType, RoomType } from '@/lib/types';

export const loginSchema = z.object({
  email: z.string().min(1).email({
    message: 'Require email',
  }),
  password: z.string().min(3, {
    message: 'Password at least 3 character',
  }),
});
export type LoginSchema = z.infer<typeof loginSchema>;
export const useLoginForm = (init?: LoginSchema) =>
  useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: init?.email || '',
      password: init?.password || '',
    },
  });

export const forgotSchema = z.object({
  email: z.string().min(1).email({
    message: 'Require email',
  }),
});
export type ForgotSchema = z.infer<typeof forgotSchema>;
export const useForgotForm = (init?: ForgotSchema) =>
  useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: init?.email || '',
    },
  });

export const resetSchema = z.object({
  password: z.string().min(3, {
    message: 'Password at least 3 character',
  }),
  confirmPassword: z.string().trim(),
});
export type ResetSchema = z.infer<typeof resetSchema>;
export const useResetForm = (init?: ResetSchema) =>
  useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: init?.password || '',
    },
  });

export const createRoomSchema = z.object({
  roomName: z.string().trim().min(1, {
    message: 'Room name is required.',
  }),
  roomImage: z.string().trim().min(1, {
    message: 'Room image is required.',
  }),
  roomType: z.nativeEnum(RoomType),
  roomPassword: z.string().trim(),
});
export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
export const useCreateRoomForm = (init?: CreateRoomSchema) =>
  useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomName: init?.roomName || '',
      roomType: init?.roomType || RoomType.PUBLIC,
      roomPassword: init?.roomPassword || '',
      roomImage: init?.roomImage || '',
    },
  });

export const changeProfilePasswordSchema = z.object({
  currentPassword: z.string().trim().min(1, {
    message: 'Require old password',
  }),
  newPassword: z.string().trim().min(1, {
    message: 'Require new password',
  }),
  confirmNewPassword: z.string().trim(),
});
export type ChangeProfilePasswordSchema = z.infer<typeof changeProfilePasswordSchema>;
export const useChangeProfilePasswordForm = (init?: ChangeProfilePasswordSchema) =>
  useForm<ChangeProfilePasswordSchema>({
    resolver: zodResolver(changeProfilePasswordSchema),
    defaultValues: {
      currentPassword: init?.currentPassword || '',
      newPassword: init?.newPassword || '',
      confirmNewPassword: init?.confirmNewPassword || '',
    },
  });

export const joinRoomSchema = z.object({
  roomId: z.string().trim().min(1, {
    message: 'Require room id',
  }),
  roomPassword: z.string().trim().min(1, {
    message: 'Require password for private room',
  }),
});
export type JoinRoomSchema = z.infer<typeof joinRoomSchema>;
export const useJoinRoomForm = (init?: JoinRoomSchema) =>
  useForm<JoinRoomSchema>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomId: init?.roomId || '',
      roomPassword: init?.roomPassword || '',
    },
  });

export const joinRoomByInviteCode = z.object({
  inviteCode: z.string().min(1, {
    message: 'Invite code is required',
  }),
});
export type JoinRoomByInviteCodeSchema = z.infer<typeof joinRoomByInviteCode>;
export const useJoinRoomByInviteCodeForm = (init?: JoinRoomByInviteCodeSchema) =>
  useForm<JoinRoomByInviteCodeSchema>({
    resolver: zodResolver(joinRoomByInviteCode),
    defaultValues: {
      inviteCode: init?.inviteCode || '',
    },
  });

export const createGroupSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(1, {
      message: 'Group name is required.',
    })
    .refine(name => name !== 'default', {
      message: "Group name cannot be 'default'",
    }),
  groupType: z.nativeEnum(GroupType),
});
export type CreateGroupSchema = z.infer<typeof createGroupSchema>;
export const useCreateGroupForm = (init?: CreateGroupSchema) =>
  useForm<CreateGroupSchema>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      groupName: init?.groupName || '',
      groupType: init?.groupType || GroupType.TEXT,
    },
  });

export const chatSchema = z.object({
  content: z.string().min(1),
});
export type ChatSchema = z.infer<typeof chatSchema>;
export const useChatForm = (init?: ChatSchema) =>
  useForm<ChatSchema>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      content: init?.content || '',
    },
  });

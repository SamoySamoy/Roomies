import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ChannelType, ServerType } from '@/lib/types';

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

export const createServerSchema = z.object({
  serverName: z.string().trim().min(1, {
    message: 'Server name is required.',
  }),
  serverImage: z.string().trim().min(1, {
    message: 'Server image is required.',
  }),
  serverType: z.nativeEnum(ServerType),
  serverPassword: z.string().trim(),
});
export type CreateServerSchema = z.infer<typeof createServerSchema>;
export const useCreateServerForm = (init?: CreateServerSchema) =>
  useForm<CreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: init?.serverName || '',
      serverType: init?.serverType || ServerType.PUBLIC,
      serverPassword: init?.serverPassword || '',
      serverImage: init?.serverImage || '',
    },
  });

export const joinServerSchema = z.object({
  serverId: z.string().trim().min(1, {
    message: 'Require room id',
  }),
  serverPassword: z.string().trim(),
});
export type JoinServerSchema = z.infer<typeof joinServerSchema>;
export const useJoinServerForm = (init?: JoinServerSchema) =>
  useForm<JoinServerSchema>({
    resolver: zodResolver(joinServerSchema),
    defaultValues: {
      serverId: init?.serverId || '',
      serverPassword: init?.serverPassword || '',
    },
  });

export const createChannelSchema = z.object({
  channelName: z
    .string()
    .trim()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine(name => name !== 'general', {
      message: "Channel name cannot be 'general'",
    }),
  channelType: z.nativeEnum(ChannelType),
});
export type CreateChannelSchema = z.infer<typeof createChannelSchema>;
export const useCreateChannelForm = (init?: CreateChannelSchema) =>
  useForm<CreateChannelSchema>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      channelName: init?.channelName || '',
      channelType: init?.channelType || ChannelType.TEXT,
    },
  });

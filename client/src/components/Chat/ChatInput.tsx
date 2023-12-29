import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/useModal';
import EmojiPicker from '@/components/EmojiPicker';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'react-router-dom';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: 'conversation' | 'group';
}

const formSchema = z.object({
  content: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

type Params = {
  roomId: string;
  groupId: string;
};

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<Params>();
  const org: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };
  const { openModal } = useModal();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const onMessage = (values: FormSchema) => {
    socket.emit('client:group:message', values.content, org);
    form.reset();
  };

  const onTyping = () => {
    socket.emit('client:group:typing', org);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onMessage)} autoComplete='off'>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <button
                    type='button'
                    onClick={() =>
                      openModal({
                        modalType: 'messageFile',
                      })
                    }
                    className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                  >
                    <Plus className='text-white dark:text-[#313338]' />
                  </button>
                  <Input
                    autoComplete='off'
                    disabled={form.formState.isLoading}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    placeholder={type === 'conversation' ? `Message ${name}` : `Message # ${name}`}
                    {...field}
                    onKeyDown={onTyping}
                  />
                  <div className='absolute top-7 right-8'>
                    <EmojiPicker
                      onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

import { Plus } from 'lucide-react';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/useModal';
import EmojiPicker from '@/components/EmojiPicker';
import { GroupOrigin, socket } from '@/lib/socket';
import { ChatSchema, useChatForm } from '@/hooks/forms';
import { Member } from '@/lib/types';

interface ChatInputProps {
  name: string;
  type: 'group' | 'conversation';
  origin: GroupOrigin;
  currentMember: Member;
}

const ChatInput = ({ name, type, origin, currentMember }: ChatInputProps) => {
  const { openModal } = useModal();
  const form = useChatForm();

  const onMessage = (values: ChatSchema) => {
    socket.emit('client:group:message:post', origin, {
      content: values.content,
    });
    form.reset();
  };

  const onTyping = () => {
    socket.emit('client:group:typing', origin, {
      email: currentMember.profile.email,
    });
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

export default ChatInput;

import { useEffect, useState } from 'react';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';

import MemberAvatar from '@/components/MemberAvatar';
import ActionTooltip from '@/components/ActionToolTip';
import { cn, dt, getFileUrl, isImageFile } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';
import { ChatSchema, useChatForm } from '@/hooks/forms';
import { useNavigate, useParams } from 'react-router-dom';
import { ConversationOrigin, socket } from '@/lib/socket';
import { DirectMessage, Member, MemberRole } from '@/lib/types';
import { CLIENT_MESSAGE_FILE_HEIGHT, CLIENT_MESSAGE_FILE_WIDTH } from '@/lib/constants';

type ChatItemProps = {
  directMessage: DirectMessage;
  currentMember: Member;
  conversationOrigin: ConversationOrigin;
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
} as const;

const ChatItem = ({ directMessage, currentMember, conversationOrigin }: ChatItemProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const form = useChatForm({
    content: directMessage.content,
  });

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isMessageOwner = currentMember.id === directMessage.memberId;
  const isFile = Boolean(directMessage.fileUrl);
  const isImage = isFile && isImageFile(directMessage.fileUrl);
  const isOtherFileType = isFile && !isImage;
  const isUpdated = directMessage.createdAt !== directMessage.updatedAt;
  // const canDeleteMessage = !directMessage.deleted && (isAdmin || isModerator || isMessageOwner);
  const canEditMessage = !directMessage.deleted && isMessageOwner && !isFile;
  const canDeleteMessage = !directMessage.deleted && isMessageOwner;

  const onMemberClick = () => {
    if (currentMember.id !== directMessage.memberId) {
    }
    navigate(`/rooms/${roomId}/conversations/${directMessage.memberId}`);
  };

  const onEdit = async (values: ChatSchema) => {
    socket.emit('client:conversation:message:update', conversationOrigin, {
      content: values.content,
      messageId: directMessage.id,
    });
    form.reset();
    setIsEditing(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keyDown', handleKeyDown);
    };
  }, []);

  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div onClick={onMemberClick} className='cursor-pointer hover:drop-shadow-md transition'>
          <MemberAvatar
            src={getFileUrl(directMessage.member.profile.imageUrl)}
            fallback={
              <p className='text-lg'>
                {directMessage.member.profile.email.split('@')[0].slice(0, 2)}
              </p>
            }
          />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center'>
              <p
                onClick={onMemberClick}
                className='font-semibold text-sm hover:underline cursor-pointer'
              >
                {directMessage.member.profile.email}
              </p>
              <ActionTooltip label={directMessage.member.role}>
                {roleIconMap[directMessage.member.role]}
              </ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              {dt.format(new Date(directMessage.createdAt))}
            </span>
          </div>
          {isImage && (
            <a
              href={getFileUrl(directMessage.fileUrl)}
              target='_blank'
              rel='noopener noreferrer'
              className={`relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-[${CLIENT_MESSAGE_FILE_HEIGHT}px] w-[${CLIENT_MESSAGE_FILE_WIDTH}px]`}
            >
              <img
                src={getFileUrl(directMessage.fileUrl)}
                alt={directMessage.content}
                className='object-cover'
              />
            </a>
          )}
          {isOtherFileType && (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={getFileUrl(directMessage.fileUrl)}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
              >
                File
              </a>
            </div>
          )}
          {!isFile && !isEditing && (
            <p
              className={cn('text-sm text-zinc-600 dark:text-zinc-300', {
                'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1': directMessage.deleted,
              })}
            >
              {directMessage.content}
              {isUpdated && !directMessage.deleted && (
                <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>(edited)</span>
              )}
            </p>
          )}
          {!isFile && isEditing && (
            <Form {...form}>
              <form
                className='flex items-center w-full gap-x-2 pt-2'
                onSubmit={form.handleSubmit(onEdit)}
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            disabled={form.formState.isSubmitting}
                            className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                            placeholder='Edited message'
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting}
                  size='sm'
                  variant='primary'
                  type='submit'
                >
                  Save
                </Button>
              </form>
              <span className='text-[10px] mt-1 text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing(true)}
                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='Delete'>
            <Trash
              onClick={() =>
                openModal({
                  modalType: 'deleteMessage',
                  data: {
                    conversationOrigin,
                    messageId: directMessage.id,
                  },
                })
              }
              className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;

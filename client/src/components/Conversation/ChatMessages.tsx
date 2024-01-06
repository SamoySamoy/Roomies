import { useState } from 'react';
import { ServerToClientEvents, socket } from '@/lib/socket';
import { Fragment, useRef, ElementRef, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { Conversation, DirectMessage, Member } from '@/lib/types';

import ChatWelcome from './ChatWelcome';
import { useChatScroll } from '@/hooks/useChatScroll';
import ChatItem from './ChatItem';
import { ConversationOrigin } from '@/lib/socket';
import {
  PagingCursorResult,
  queryKeyFactory,
  useDirectMessagesInfiniteQuery,
} from '@/hooks/queries';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

type ChatMessagesProps = {
  name: string;
  type: 'group' | 'conversation';
  currentMember: Member;
  currentConversation: Conversation;
  conversationOrigin: ConversationOrigin;
};

const ChatMessages = ({
  currentConversation,
  currentMember,
  conversationOrigin: origin,
  name,
  type,
}: ChatMessagesProps) => {
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const [typing, setTyping] = useState('');
  const typingTimer = useRef<any>(null);
  // const [join, setJoin] = useState('');
  // const [leave, setLeave] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { auth } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useDirectMessagesInfiniteQuery(currentConversation.id);

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  /* Listening chat event */
  useEffect(() => {
    socket.emit('client:conversation:join', origin, {
      email: auth.email!,
    });

    // const onJoin: ServerToClientEvents['server:conversation:join:success'] = msg => {
    //   setJoin(msg);
    // };
    // const onLeave: ServerToClientEvents['server:conversation:leave:success'] = msg => {
    //   setLeave(msg);
    // };
    const onTyping: ServerToClientEvents['server:conversation:typing:success'] = msg => {
      setTyping(msg);
      if (typingTimer?.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => {
        setTyping('');
      }, 1500);
    };
    const onNewMessage: ServerToClientEvents['server:conversation:message:post:success'] =
      newDirectMessage => {
        queryClient.setQueryData(
          queryKeyFactory.directMessages(currentConversation.id),
          (oldData: InfiniteData<PagingCursorResult<DirectMessage>, unknown>) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return {
                pages: [
                  {
                    items: [newDirectMessage],
                  },
                ],
              };
            }
            const newData = [...oldData.pages];
            newData[0] = {
              ...newData[0],
              items: [newDirectMessage, ...newData[0].items],
            };
            return {
              ...oldData,
              pages: newData,
            };
          },
        );
      };
    const onUpdateDirectMessage: ServerToClientEvents['server:conversation:message:update:success'] =
      updatedDirectMessage => {
        queryClient.setQueryData(
          queryKeyFactory.directMessages(currentConversation.id),
          (oldData: InfiniteData<PagingCursorResult<DirectMessage>, unknown>) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return oldData;
            }
            const newData = oldData.pages.map(page => {
              return {
                ...page,
                items: page.items.map(directMessage => {
                  if (directMessage.id === updatedDirectMessage.id) {
                    return updatedDirectMessage;
                  }
                  return directMessage;
                }),
              };
            });
            return {
              ...oldData,
              pages: newData,
            };
          },
        );
      };

    const onDeleteDirectMessage: ServerToClientEvents['server:conversation:message:delete:success'] =
      deletedDirectMessage => {
        queryClient.setQueryData(
          queryKeyFactory.directMessages(currentConversation.id),
          (oldData: InfiniteData<PagingCursorResult<DirectMessage>, unknown>) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return oldData;
            }
            const newData = oldData.pages.map(page => {
              return {
                ...page,
                items: page.items.map(directMessage => {
                  if (directMessage.id === deletedDirectMessage.id) {
                    return deletedDirectMessage;
                  }
                  return directMessage;
                }),
              };
            });
            return {
              ...oldData,
              pages: newData,
            };
          },
        );
      };

    // socket.on('server:conversation:join:success', onJoin);
    // socket.on('server:conversation:leave:success', onLeave);
    socket.on('server:conversation:typing:success', onTyping);
    socket.on('server:conversation:message:post:success', onNewMessage);
    socket.on('server:conversation:message:upload:success', onNewMessage);
    socket.on('server:conversation:message:update:success', onUpdateDirectMessage);
    socket.on('server:conversation:message:delete:success', onDeleteDirectMessage);

    const onError = (msg: string) => {
      toast({
        title: 'Error',
        description: msg,
        variant: 'error',
      });
    };
    socket.on('server:conversation:join:error', onError);
    socket.on('server:conversation:leave:error', onError);
    socket.on('server:conversation:typing:error', onError);
    socket.on('server:conversation:message:post:error', onError);
    socket.on('server:conversation:message:upload:error', onError);
    socket.on('server:conversation:message:update:error', onError);
    socket.on('server:conversation:message:delete:error', onError);

    return () => {
      socket.emit('client:conversation:leave', origin, {
        email: auth.email!,
      });

      // socket.off('server:conversation:join:success', onJoin);
      // socket.off('server:conversation:leave:success', onLeave);
      socket.off('server:conversation:typing:success', onTyping);
      socket.off('server:conversation:message:post:success', onNewMessage);
      socket.off('server:conversation:message:upload:success', onNewMessage);
      socket.off('server:conversation:message:update:success', onUpdateDirectMessage);
      socket.off('server:conversation:message:delete:success', onDeleteDirectMessage);

      socket.off('server:conversation:join:error', onError);
      socket.off('server:conversation:leave:error', onError);
      socket.off('server:conversation:typing:error', onError);
      socket.off('server:conversation:message:post:error', onError);
      socket.off('server:conversation:message:upload:error', onError);
      socket.off('server:conversation:message:update:error', onError);
      socket.off('server:conversation:message:delete:error', onError);
    };
  }, []);

  if (isPending) {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Something went wrong!</p>
      </div>
    );
  }

  return (
    <div ref={chatRef} className='flex-1 flex flex-col overflow-y-auto'>
      {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className='flex justify-center'>
          {isFetchingNextPage ? (
            <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
            >
              Load previous messages
            </button>
          )}
        </div>
      )}
      <div className='flex flex-col-reverse'>
        {data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.items.map(dirrectMessage => (
              <ChatItem
                key={dirrectMessage.id}
                directMessage={dirrectMessage}
                currentMember={currentMember}
                conversationOrigin={origin}
              />
            ))}
          </Fragment>
        ))}
      </div>
      {typing && (
        <p className='text-sm text-center dark:text-slate-400/80 text-slate-600/80'>{typing}</p>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;

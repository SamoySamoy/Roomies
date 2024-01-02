import { useState } from 'react';
import { ServerToClientEvents, socket } from '@/lib/socket';
import { Fragment, useRef, ElementRef, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { Group, Member, Message } from '@/lib/types';

import ChatWelcome from './ChatWelcome';
import { useChatScroll } from '@/hooks/useChatScroll';
import ChatItem from './ChatItem';
import { GroupOrigin } from '@/lib/socket';
import { PagingCursorResult, queryKeyFactory, useMessagesInfiniteQuery } from '@/hooks/queries';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

type ChatMessagesProps = {
  name: string;
  type: 'group' | 'conversation';
  currentGroup: Group;
  currentMember: Member;
  origin: GroupOrigin;
};

const ChatMessages = ({ currentGroup, currentMember, origin, name, type }: ChatMessagesProps) => {
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const [typing, setTyping] = useState('');
  const typingTimer = useRef<any>(null);
  const [join, setJoin] = useState('');
  const [leave, setLeave] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { auth } = useAuth();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useMessagesInfiniteQuery(currentGroup.id);

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  /* Listening chat event */
  useEffect(() => {
    socket.emit('client:group:join', origin, {
      email: auth.email!,
    });

    const onJoin: ServerToClientEvents['server:group:join:success'] = msg => {
      setJoin(msg);
    };
    const onLeave: ServerToClientEvents['server:group:leave:success'] = msg => {
      setLeave(msg);
    };
    const onTyping: ServerToClientEvents['server:group:typing:success'] = msg => {
      setTyping(msg);
      if (typingTimer?.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => {
        setTyping('');
      }, 1500);
    };
    const onNewMessage: ServerToClientEvents['server:group:message:post:success'] = newMessage => {
      queryClient.setQueryData(
        queryKeyFactory.messages(currentGroup.id),
        (oldData: InfiniteData<PagingCursorResult<Message>, unknown>) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [newMessage],
                },
              ],
            };
          }
          const newData = [...oldData.pages];
          newData[0] = {
            ...newData[0],
            items: [newMessage, ...newData[0].items],
          };
          return {
            ...oldData,
            pages: newData,
          };
        },
      );
    };
    const onUpdateMessage: ServerToClientEvents['server:group:message:update:success'] =
      updatedMessage => {
        queryClient.setQueryData(
          queryKeyFactory.messages(currentGroup.id),
          (oldData: InfiniteData<PagingCursorResult<Message>, unknown>) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return oldData;
            }
            const newData = oldData.pages.map(page => {
              return {
                ...page,
                items: page.items.map(message => {
                  if (message.id === updatedMessage.id) {
                    return updatedMessage;
                  }
                  return message;
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

    const onDeleteMessage: ServerToClientEvents['server:group:message:delete:success'] =
      updatedMessage => {
        queryClient.setQueryData(
          queryKeyFactory.messages(currentGroup.id),
          (oldData: InfiniteData<PagingCursorResult<Message>, unknown>) => {
            if (!oldData || !oldData.pages || oldData.pages.length === 0) {
              return oldData;
            }
            const newData = oldData.pages.map(page => {
              return {
                ...page,
                items: page.items.map(message => {
                  if (message.id === updatedMessage.id) {
                    return updatedMessage;
                  }
                  return message;
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

    socket.on('server:group:join:success', onJoin);
    socket.on('server:group:leave:success', onLeave);
    socket.on('server:group:typing:success', onTyping);
    socket.on('server:group:message:post:success', onNewMessage);
    socket.on('server:group:message:upload:success', onNewMessage);
    socket.on('server:group:message:update:success', onUpdateMessage);
    socket.on('server:group:message:delete:success', onDeleteMessage);

    const onError = (msg: string) => {
      toast({
        title: 'Error',
        description: msg,
      });
    };
    socket.on('server:group:join:error', onError);
    socket.on('server:group:leave:error', onError);
    socket.on('server:group:typing:error', onError);
    socket.on('server:group:message:post:error', onError);
    socket.on('server:group:message:upload:error', onError);
    socket.on('server:group:message:update:error', onError);
    socket.on('server:group:message:delete:error', onError);

    return () => {
      socket.emit('client:group:leave', origin, {
        email: auth.email!,
      });

      socket.off('server:group:join:success', onJoin);
      socket.off('server:group:leave:success', onLeave);
      socket.off('server:group:typing:success', onTyping);
      socket.off('server:group:message:post:success', onNewMessage);
      socket.off('server:group:message:upload:success', onNewMessage);
      socket.off('server:group:message:update:success', onUpdateMessage);
      socket.off('server:group:message:delete:success', onDeleteMessage);

      socket.off('server:group:join:error', onError);
      socket.off('server:group:leave:error', onError);
      socket.off('server:group:typing:error', onError);
      socket.off('server:group:message:post:error', onError);
      socket.off('server:group:message:upload:error', onError);
      socket.off('server:group:message:update:error', onError);
      socket.off('server:group:message:delete:error', onError);
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
            {page.items.map(message => (
              <ChatItem
                key={message.id}
                message={message}
                currentMember={currentMember}
                origin={origin}
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

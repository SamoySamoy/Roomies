import { useState } from 'react';
import { ServerToClientEvents, socket } from '@/lib/socket';
import { Fragment, useRef, ElementRef, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { Group, Member, Message, Profile, Room } from '@/lib/types';

import ChatWelcome from './ChatWelcome';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';
import ChatItem from './ChatItem';
import { GroupOrigin } from '@/lib/socket';
import { CursorResult, queryKeyFactory, useMessagesInfiniteQuery } from '@/hooks/queries';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';

type ChatMessagesProps = {
  name: string;
  type: 'group' | 'conversation';
  currentGroup: Group;
  currentRoom: Room;
  currentMember: Member;
  origin: GroupOrigin;
};

const ChatMessages = ({
  currentGroup,
  currentRoom,
  currentMember,
  origin,
  name,
  type,
}: ChatMessagesProps) => {
  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState('');
  const [join, setJoin] = useState('');
  const [leave, setLeave] = useState('');
  const [justLoad, setJustLoad] = useState(false);
  const queryClient = useQueryClient();
  const typingTimer = useRef<any>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } =
    useMessagesInfiniteQuery(currentGroup.id);
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.messages?.length ?? 0,
  });

  useEffect(() => {
    socket.emit('client:group:join', origin);

    const onJoin: ServerToClientEvents['server:group:join'] = msg => {
      setJoin(msg);
    };
    const onLeave: ServerToClientEvents['server:group:leave'] = msg => {
      setLeave(msg);
    };
    const onTyping: ServerToClientEvents['server:group:typing'] = msg => {
      setTyping(msg);
      if (typingTimer?.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => {
        setTyping('');
      }, 1500);
    };
    const onMessage: ServerToClientEvents['server:group:message:post'] = message => {
      queryClient.setQueryData(
        queryKeyFactory.messages(currentGroup.id),
        (oldData: InfiniteData<CursorResult, unknown>) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  messages: [message],
                },
              ],
            };
          }
          const newData = [...oldData.pages];
          newData[0] = {
            ...newData[0],
            messages: [message, ...newData[0].messages],
          };
          return {
            ...oldData,
            pages: newData,
          };
        },
      );
    };
    const onUpdateMessage: ServerToClientEvents['server:group:message:update'] = updatedMessage => {
      queryClient.setQueryData(
        queryKeyFactory.messages(currentGroup.id),
        (oldData: InfiniteData<CursorResult, unknown>) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }
          const newData = oldData.pages.map(page => {
            return {
              ...page,
              messages: page.messages.map(message => {
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

    const onDeleteMessage: ServerToClientEvents['server:group:message:update'] = updatedMessage => {
      queryClient.setQueryData(
        queryKeyFactory.messages(currentGroup.id),
        (oldData: InfiniteData<CursorResult, unknown>) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }
          const newData = oldData.pages.map(page => {
            return {
              ...page,
              messages: page.messages.map(message => {
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

    socket.on('server:group:join', onJoin);
    socket.on('server:group:leave', onLeave);
    socket.on('server:group:typing', onTyping);
    socket.on('server:group:message:post', onMessage);
    socket.on('server:group:message:update', onUpdateMessage);
    socket.on('server:group:message:delete', onDeleteMessage);

    return () => {
      socket.emit('client:group:leave', origin);

      socket.off('server:group:join', onJoin);
      socket.off('server:group:leave', onLeave);
      socket.off('server:group:typing', onTyping);
      socket.off('server:group:message:post', onMessage);
      socket.off('server:group:message:update', onUpdateMessage);
      socket.off('server:group:message:delete', onDeleteMessage);
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
            {page.messages.map(message => (
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

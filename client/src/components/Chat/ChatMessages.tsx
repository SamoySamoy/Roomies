import { useState } from 'react';
import { ServerToClientEvents, socket } from '@/lib/socket';
import { Fragment, useRef, ElementRef, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { Group, Member, Message, Profile, Room } from '@/lib/types';
import { dt } from '@/lib/utils';

// import { useChatQuery } from '@/hooks/use-chat-query';
// import { useChatSocket } from '@/hooks/use-chat-socket';
// import { useChatScroll } from '@/hooks/use-chat-scroll';

import ChatWelcome from './ChatWelcome';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';
import { useChatQuery } from '@/hooks/useChatQuery';
import ChatItem from './ChatItem';
import { GroupOrigin } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
// import { ChatItem } from './chat-item';

type ChatMessagesProps = {
  // name: string;
  // member: Member;
  // chatId: string;
  // apiUrl: string;
  // socketUrl: string;
  // socketQuery: Record<string, string>;
  // paramKey: 'channelId' | 'conversationId';
  // paramValue: string;
  // type: 'channel' | 'conversation';
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
}: // name,
// member,
// chatId,
// apiUrl,
// socketUrl,
// socketQuery,
// paramKey,
// paramValue,
// type,
ChatMessagesProps) => {
  // const queryKey = `chat:${chatId}`;
  // const addKey = `chat:${chatId}:messages`;
  // const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<'div'>>(null);
  const bottomRef = useRef<ElementRef<'div'>>(null);

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({
  //   queryKey,
  //   apiUrl,
  //   paramKey,
  //   paramValue,
  // });
  // useChatSocket({ queryKey, addKey, updateKey });
  // useChatScroll({
  //   chatRef,
  //   bottomRef,
  //   loadMore: fetchNextPage,
  //   shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  //   count: data?.pages?.[0]?.items?.length ?? 0,
  // });

  // if (status === 'loading') {
  //   return (
  //     <div className='flex flex-col flex-1 justify-center items-center'>
  //       <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
  //       <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading messages...</p>
  //     </div>
  //   );
  // }

  // if (status === 'error') {
  //   return (
  //     <div className='flex flex-col flex-1 justify-center items-center'>
  //       <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
  //       <p className='text-xs text-zinc-500 dark:text-zinc-400'>Something went wrong!</p>
  //     </div>
  //   );
  // }

  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState('');
  const [join, setJoin] = useState('');
  const [leave, setLeave] = useState('');
  const [justLoad, setJustLoad] = useState(false);
  const typingTimer = useRef<any>(null);

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
    const onGroupMessages: ServerToClientEvents['server:group:message:get'] = messages => {
      setMessages(messages);
      setJustLoad(true);
    };
    const onMessage: ServerToClientEvents['server:group:message:post'] = message => {
      // message new -> old
      setMessages(prev => [message, ...prev]);
    };

    socket.on('server:group:join', onJoin);
    socket.on('server:group:leave', onLeave);
    socket.on('server:group:typing', onTyping);
    socket.on('server:group:message:post', onMessage);
    socket.on('server:group:message:get', onGroupMessages);

    return () => {
      socket.emit('client:group:leave', origin);

      socket.off('server:group:join', onJoin);
      socket.off('server:group:leave', onLeave);
      socket.off('server:group:typing', onTyping);
      socket.off('server:group:message:get', onGroupMessages);
      socket.off('server:group:message:post', onMessage);
    };
  }, []);

  useEffect(() => {
    if (justLoad) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [justLoad]);

  useEffect(() => {
    const shouldScroll = () => {
      // console.log(chatRef.current?.scrollHeight!); // Độ dài scroll của cả khối
      // console.log(chatRef.current?.scrollTop!); // Scroll đang cách top của cả khối là bao nhiêu
      // console.log(chatRef.current?.clientHeight!); // Độ dài khi hiển thị lên màn hình
      const distanceFromBottom =
        chatRef.current?.scrollHeight! -
        chatRef.current?.scrollTop! -
        chatRef.current?.clientHeight!;

      return distanceFromBottom <= chatRef.current?.clientHeight!;
    };

    if (shouldScroll()) {
      setJustLoad(false);
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messages.length]);

  return (
    <div ref={chatRef} className='flex-1 flex flex-col overflow-y-auto'>
      {/* {!hasNextPage && <div className='flex-1' />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && ( */}
      <div className='flex justify-center'>
        {/* {isFetchingNextPage ? (
            <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />
          ) : ( */}
        <button
          // onClick={() => fetchNextPage()}
          className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
        >
          Load previous messages
        </button>
        {/* )} */}
      </div>
      {/* )} */}
      <div className='flex flex-col-reverse'>
        {messages.map(message => (
          <ChatItem
            message={message}
            currentMember={currentMember}
            origin={origin}
            key={message.id}
          />
        ))}
        {/* {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={i18n.format(new Date(message.createdAt))}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))} */}
      </div>
      {typing && (
        <p className='text-sm text-center dark:text-slate-400/80 text-slate-600/80'>{typing}</p>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;

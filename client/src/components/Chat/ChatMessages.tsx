import { useState } from 'react';
import { socket } from '@/lib/socket';
import { Fragment, useRef, ElementRef, useEffect } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { Group, Member, Message, Profile, Room } from '@/lib/types';
import { i18n } from '@/lib/utils';

// import { useChatQuery } from '@/hooks/use-chat-query';
// import { useChatSocket } from '@/hooks/use-chat-socket';
// import { useChatScroll } from '@/hooks/use-chat-scroll';

import ChatWelcome from './ChatWelcome';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useChatScroll } from '@/hooks/useChatScroll';
import { useChatQuery } from '@/hooks/useChatQuery';
import { ChatItem } from './ChatItem';
import { GroupOrigin } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
// import { ChatItem } from './chat-item';

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

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
  group: Group;
  room: Room;
};

export const ChatMessages = ({
  group,
  room,
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

  // const chatRef = useRef<ElementRef<'div'>>(null);
  // const bottomRef = useRef<ElementRef<'div'>>(null);

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
  const { auth } = useAuth();

  const org: GroupOrigin = {
    groupId: group.id,
    roomId: room?.id!,
    profileId: auth.profileId!,
  };
  const [messages, setMessages] = useState<string[]>([]);
  const [typing, setTyping] = useState('');
  const [join, setJoin] = useState('');
  const [leave, setLeave] = useState('');
  const typingTimer = useRef<any>(null);

  useEffect(() => {
    socket.emit('client:group:join', org);

    const onJoin = (msg: string) => {
      setJoin(msg);
    };
    const onLeave = (msg: string) => {
      setLeave(msg);
    };
    const onTyping = (msg: string) => {
      setTyping(msg);
      if (typingTimer?.current) {
        clearTimeout(typingTimer.current);
      }
      typingTimer.current = setTimeout(() => {
        setTyping('');
      }, 2000);
    };
    const onMessage = (msg: string) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('server:join', onJoin);
    socket.on('server:leave', onLeave);
    socket.on('server:typing', onTyping);
    socket.on('server:message', onMessage);

    return () => {
      socket.emit('client:group:leave', org);
      socket.off('server:join', onJoin);
      socket.off('server:typing', onTyping);
      socket.off('server:message', onMessage);
    };
  }, []);

  return (
    <div
      // ref={chatRef}
      className='flex-1 flex flex-col py-4 overflow-y-auto'
    >
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
      <div className='flex flex-col-reverse mt-auto'>
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
      {/* <div ref={bottomRef} /> */}
    </div>
  );
};

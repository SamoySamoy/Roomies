import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ChatHeader from '@/components/Chat/ChatHeader';
import ChatInput from '@/components/Chat/ChatInput';
import ChatMessages from '@/components/Chat/ChatMessages';
import { GroupOrigin, ServerToClientEvents, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { queryKeyFactory, useRoomQuery } from '@/hooks/queries';
import { LoadingPage } from '@/components/Loading';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Room } from '@/lib/types';
import { members } from '@/lib/fakeData';
import { getQueryString } from '@/lib/utils';

const ChannelPage = () => {
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryObj = {
    groups: true,
    members: true,
    profilesOfMembers: true,
  } as const;
  const {
    data: room,
    isPending,
    isFetching,
    isRefetching,
    isError,
  } = useRoomQuery(roomId!, queryObj);
  const currentGroup = room?.groups.find(group => group.id === groupId);
  const currentMember = room?.members.find(member => member.profileId === auth.profileId);

  if (isPending || isFetching || isRefetching) {
    return <LoadingPage />;
  }
  if (isError || !room) {
    return <Navigate to={'/error-page'} replace />;
  }

  useEffect(() => {
    socket.emit('client:room:join', origin, {
      email: auth.email!,
    });

    const onKick: ServerToClientEvents['server:room:kick:success'] = content => {
      // queryClient.setQueryData(queryKeyFactory.room(roomId!, []), (oldData: Room | undefined) => {
      //   if (!oldData) return oldData;

      //   const newMemberData = oldData.members.filter(member => member.id !== content.memberId);
      //   return {
      //     ...oldData,
      //     members: newMemberData,
      //   } satisfies Room;
      // });

      // Nếu người được cập nhật nằm trong danh sách, và có cùng profileId với auth.profileId => người được cập nhật là mình
      if (
        !Boolean(
          room.members.find(
            member => member.id === content.memberId && member.profileId === auth.profileId,
          ),
        )
      )
        return;

      toast({
        title: 'Notification',
        description: `You have been kicked out of room ${room.name} by Admin`,
      });
      navigate('/my-rooms');
    };

    const onChangeRole: ServerToClientEvents['server:room:role:success'] = content => {
      console.log('Role Change');

      // Nếu người được cập nhật nằm trong danh sách, và có cùng profileId với auth.profileId => người được cập nhật là mình
      if (
        !Boolean(
          room.members.find(
            member => member.id === content.memberId && member.profileId === auth.profileId,
          ),
        )
      )
        return;

      const { queryValues } = getQueryString(queryObj);
      queryClient.setQueryData(
        queryKeyFactory.room(roomId!, queryValues),
        (oldData: Room | undefined) => {
          console.log('In query client');

          if (!oldData) return oldData;

          console.log('Have data');

          const newMemberData = oldData.members.map(member => {
            if (member.id === content.memberId) {
              member.role = content.role;
            }
            return member;
          });

          console.log(newMemberData);

          return {
            ...oldData,
            members: newMemberData,
          } satisfies Room;
        },
      );
      toast({
        title: 'Notification',
        description: (
          <span>
            Your role have been changed to{' '}
            <span className='capitalize'>{content.role.toLowerCase()}</span>
          </span>
        ),
      });
    };

    socket.on('server:room:kick:success', onKick);
    socket.on('server:room:role:success', onChangeRole);

    const onError = (msg: string) => {
      toast({
        title: 'Error',
        description: msg,
      });
    };
    socket.on('server:room:join:error', onError);
    socket.on('server:room:leave:error', onError);

    return () => {
      socket.emit('client:room:leave', origin, {
        email: auth.email!,
      });

      socket.off('server:room:kick:success', onKick);
      socket.off('server:room:role:success', onChangeRole);

      socket.off('server:room:join:error', onError);
      socket.off('server:room:leave:error', onError);
    };
  }, []);

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={currentGroup?.name!} type='group' />
      <ChatMessages
        key={groupId}
        name={currentGroup?.name!}
        type='group'
        origin={origin}
        currentGroup={currentGroup!}
        currentMember={currentMember!}
      />
      <ChatInput name={currentGroup?.name!} type='group' origin={origin} />
    </div>
  );
};

export default ChannelPage;

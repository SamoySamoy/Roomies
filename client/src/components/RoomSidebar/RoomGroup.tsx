import { LucideIcon, Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
// import { useParams, useRouter } from "next/navigation";

import { cn } from '@/lib/utils';
import ActionTooltip from '@/components/ActionToolTip';
import { useModal } from '@/hooks/useModal';
import { ModalType } from '@/hooks/useModal';
import { Channel, ChannelType, MemberRole, Server } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import { Peer } from 'peerjs'

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap: Record<ChannelType, LucideIcon> = {
  // [ChannelType.TEXT]: Hash,
  // [ChannelType.AUDIO]: Mic,
  // [ChannelType.VIDEO]: Video,
  text: Hash,
  audio: Mic,
  video: Video,
};

const RoomGroup = ({ channel, server, role }: ServerChannelProps) => {
  const { openModal } = useModal();
  const navigate = useNavigate();
  // const params = useParams();
  // const router = useRouter();

  const Icon = iconMap[channel.type];

  const onClick = () => {
    if (channel.type === 'audio') {
      console.log('join audio room' + channel.id);
      navigate('/rooms/1231231/audios/testId');
    }
    
    // navigate('groups/21312301');
    // router.push(`/servers/${params?.serverId}/groups/${channel.id}`)
  };

  const onAction = (e: React.MouseEvent, modalType: ModalType) => {
    e.stopPropagation();
    openModal({
      modalType,
      data: {
        channel,
        server,
      },
    });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        {
          // 'bg-zinc-700/20 dark:bg-zinc-700': params?.channelId === channel.id,
        },
      )}
    >
      <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          {
            // 'text-primary dark:text-zinc-200 dark:group-hover:text-white': params?.channelId === channel.id,
          },
        )}
      >
        {channel.name}
      </p>
      {/* {channel.name !== 'general' && role !== MemberRole.GUEST && ( */}
      {channel.name !== 'general' && role !== 'guest' && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='Edit'>
            <Edit
              onClick={e => onAction(e, 'editChannel')}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
          <ActionTooltip label='Delete'>
            <Trash
              onClick={e => onAction(e, 'deleteChannel')}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
      )}
    </button>
  );
  
};

export default RoomGroup;

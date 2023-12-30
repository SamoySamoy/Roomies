import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import ActionTooltip from '@/components/ActionToolTip';
import { useModal } from '@/hooks/useModal';
import { ModalType } from '@/hooks/useModal';
import { Group, GroupType, MemberRole, Room } from '@/lib/types';
import { Link, useParams } from 'react-router-dom';

interface RoomGroupProps {
  group: Group;
  room: Room;
  role?: MemberRole;
}

const iconMap = {
  [GroupType.TEXT]: Hash,
  [GroupType.AUDIO]: Mic,
  [GroupType.VIDEO]: Video,
} as const;


const groupMap = {
  [GroupType.TEXT]: 'groups',
  [GroupType.AUDIO]: 'audiogroups',
  [GroupType.VIDEO]: 'videogroups',
} as const;

const RoomGroup = ({ group, room, role }: RoomGroupProps) => {
  const { openModal } = useModal();
  const { groupId } = useParams<{ groupId: string }>();
  const Icon = iconMap[group.type];
  const groups = groupMap[group.type];

  const onAction = (e: React.MouseEvent, modalType: ModalType) => {
    e.stopPropagation();
    openModal({
      modalType,
      data: {
        group,
        room,
      },
    });
  };

  return (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        {
          'bg-zinc-700/20 dark:bg-zinc-700': groupId === group.id,
        },
      )}
    >
      <Link to={`/rooms/${room.id}/${groups}/${group.id}`} className='flex gap-x-2'>
        <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400' />
        <p
          className={cn(
            'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
            {
              'text-primary dark:text-zinc-200 dark:group-hover:text-white': groupId === group.id,
            },
          )}
        >
          {group.name.length >= 12 ? group.name.slice(0, 12) + '...' : group.name}
        </p>
      </Link>

      {group.name !== 'default' && role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='Edit'>
            <Edit
              onClick={e => onAction(e, 'editGroup')}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-indigo-400 dark:text-zinc-400 dark:hover:text-indigo-500 transition'
            />
          </ActionTooltip>
          <ActionTooltip label='Delete'>
            <Trash
              onClick={e => onAction(e, 'deleteGroup')}
              className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-700 transition'
            />
          </ActionTooltip>
        </div>
      )}
      {group.name === 'default' && (
        <Lock className='ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400' />
      )}
    </button>
  );
};

export default RoomGroup;

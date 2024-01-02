import { Fragment } from 'react';

import { ShieldAlert, ShieldCheck } from 'lucide-react';
import MemberAvatar from '@/components/MemberAvatar';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import ActionTooltip from '@/components/ActionToolTip';
import { cn, getFileUrl } from '@/lib/utils';
import { Member, MemberRole } from '@/lib/types';

interface RoomMemberProps {
  member: Member; // Member with Profile
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
} as const;

const RoomMember = ({ member }: RoomMemberProps) => {
  const { auth } = useAuth();
  const { memberId, roomId } = useParams<{ memberId: string; roomId: string }>();
  const navigate = useNavigate();
  const icon = roleIconMap[member.role];

  const isYourself = member.profileId === auth.profileId;

  const onNavigate = () => {
    if (isYourself) return;
    navigate(`/rooms/${roomId}/conversations/${member.id}`);
  };

  const content = (
    <button
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        {
          'bg-zinc-700/20 dark:bg-zinc-700': memberId === member.id,
        },
      )}
      onClick={onNavigate}
    >
      <MemberAvatar
        src={getFileUrl(member.profile.imageUrl)}
        fallback={
          <p className='text-foreground'>{member.profile.email.split('@')[0].slice(0, 2)}</p>
        }
        className='h-8 w-8 md:h-8 md:w-8'
      />
      <div className='flex flex-col gap-y-1 items-start'>
        <div className='flex items-center gap-x-2'>
          <p
            className={cn(
              'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
              {
                'text-primary dark:text-zinc-200 dark:group-hover:text-white':
                  memberId === member.id,
              },
            )}
          >
            {member.profile.email}
          </p>
          {icon}
        </div>
        <p className='font-normal text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition capitalize'>
          {member.role.toLowerCase()}
          {isYourself && ' - Yourself'}
        </p>
      </div>
    </button>
  );

  return isYourself ? (
    <Fragment>{content}</Fragment>
  ) : (
    <ActionTooltip
      side='right'
      align='center'
      label={<p className='text-sm text-foreground'>Conversation with {member.profile.email}</p>}
    >
      {content}
    </ActionTooltip>
  );
};

export default RoomMember;

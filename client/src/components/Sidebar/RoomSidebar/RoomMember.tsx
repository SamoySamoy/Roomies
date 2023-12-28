import { Member, MemberRole, Room } from '@/lib/types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
// import { useParams, useRouter } from "next/navigation";

import { cn } from '@/lib/utils';
import MemberAvatar from '@/components/MemberAvatar';
import { useNavigate, useParams } from 'react-router-dom';

interface RoomMemberProps {
  member: Member; // Member with Profile
  room: Room;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
} as const;

const RoomMember = ({ member, room }: RoomMemberProps) => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const icon = roleIconMap[member.role];

  const onNavigate = () => {
    navigate(`/rooms/${room.id}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onNavigate}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        {
          'bg-zinc-700/20 dark:bg-zinc-700': memberId === member.id,
        },
      )}
    >
      <MemberAvatar
        src={member.profile.imageUrl}
        fallback={
          <p className='text-foreground'>{member.profile.email.split('@')[0].slice(0, 2)}</p>
        }
        className='h-8 w-8 md:h-8 md:w-8'
      />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          {
            'text-primary dark:text-zinc-200 dark:group-hover:text-white': memberId === member.id,
          },
        )}
      >
        {member.profile.email}
      </p>
      {icon}
    </button>
  );
};

export default RoomMember;

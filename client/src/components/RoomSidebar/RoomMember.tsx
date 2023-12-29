import { Member, MemberRole, Profile, Server } from '@/lib/types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
// import { useParams, useRouter } from "next/navigation";

import { cn } from '@/lib/utils';
import MemberAvatar from '@/components/MemberAvatar';
import { useNavigate } from 'react-router-dom';

interface ServerMemberProps {
  // member: Member & { profile: Profile };
  member: Member;
  server: Server;
}

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  // [MemberRole.GUEST]: null,
  // [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  // [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />
  guest: null,
  moderator: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  admin: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
};

const RoomMember = ({ member, server }: ServerMemberProps) => {
  const navigate = useNavigate();
  // const params = useParams();
  // const router = useRouter();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    // navigate("/rooms/1231231/groups/21312301");
    navigate('conversations/21312301');
    // router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        {
          // "bg-zinc-700/20 dark:bg-zinc-700" :params?.memberId === member.id,
        },
      )}
    >
      <MemberAvatar
        // src={member.profile.imageUrl}
        src={member.profileId}
        fallback={<p className='text-foregroud'>UN</p>}
        className='h-8 w-8 md:h-8 md:w-8'
      />
      <p
        className={cn(
          'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          {
            // 'text-primary dark:text-zinc-200 dark:group-hover:text-white': params?.memberId === member.id,
          },
        )}
      >
        {/* {member.profile.name} */}
        {member.profileId}
      </p>
      {icon}
    </button>
  );
};

export default RoomMember;
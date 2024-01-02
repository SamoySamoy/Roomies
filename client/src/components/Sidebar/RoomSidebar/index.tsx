import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { GroupType, MemberRole, Room } from '@/lib/types';
import RoomHeader from './RoomHeader';
import RoomSearch from './RoomSearch';
import GroupListSection from './RoomSection';
import RoomGroup from './RoomGroup';
import RoomMember from './RoomMember';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const groupIcon = {
  [GroupType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [GroupType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [GroupType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
} as const;

const roleIcon = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
} as const;

type Props = {
  room: Room;
};

const RoomSidebar = ({ room }: Props) => {
  const { auth } = useAuth();
  const textGroups = room.groups.filter(group => group.type === GroupType.TEXT);
  const audioGroups = room.groups.filter(group => group.type === GroupType.AUDIO);
  const videoGroups = room.groups.filter(group => group.type === GroupType.VIDEO);
  const otherMembers = room.members.filter(member => member.profileId !== auth.profileId!);
  const role = room.members.find(member => member.profileId === auth.profileId!)?.role;

  if (!role) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <RoomHeader room={room} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <RoomSearch
            data={[
              {
                label: 'Text Groups',
                type: 'group',
                data: textGroups?.map(group => ({
                  id: group.id,
                  name: group.name,
                  icon: groupIcon[group.type],
                })),
              },
              {
                label: 'Voice Groups',
                type: 'group',
                data: audioGroups?.map(group => ({
                  id: group.id,
                  name: group.name,
                  icon: groupIcon[group.type],
                })),
              },
              {
                label: 'Video Groups',
                type: 'group',
                data: videoGroups?.map(group => ({
                  id: group.id,
                  name: group.name,
                  icon: groupIcon[group.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: otherMembers.map(member => ({
                  id: member.id,
                  name: member.profile.email,
                  icon: roleIcon[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textGroups?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='groups'
              groupType={GroupType.TEXT}
              role={role}
              label='Text Groups'
              room={room}
            />
            <div className='space-y-[2px]'>
              {textGroups.map(group => (
                <RoomGroup key={group.id} group={group} role={role} room={room} />
              ))}
            </div>
          </div>
        )}
        {!!audioGroups?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='groups'
              groupType={GroupType.AUDIO}
              role={role}
              label='Voice Groups'
              room={room}
            />
            <div className='space-y-[2px]'>
              {audioGroups.map(group => (
                <RoomGroup key={group.id} group={group} role={role} room={room} />
              ))}
            </div>
          </div>
        )}
        {!!videoGroups?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='groups'
              groupType={GroupType.VIDEO}
              role={role}
              label='Video Groups'
              room={room}
            />
            <div className='space-y-[2px]'>
              {videoGroups.map(group => (
                <RoomGroup key={group.id} group={group} role={role} room={room} />
              ))}
            </div>
          </div>
        )}
        {room.members.length && (
          <div className='mb-2'>
            <GroupListSection sectionType='members' role={role} label='Other Members' room={room} />
            <div className='space-y-[2px]'>
              {room.members.map(member => (
                <RoomMember key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoomSidebar;

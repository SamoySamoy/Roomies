import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { Group, GroupType, MemberRole } from '@/lib/types';
import { channels, members, servers } from '@/lib/fakeData';
import RoomHeader from './RoomHeader';
import RoomSearch from './RoomSearch';
import GroupListSection from './RoomSection';
import RoomGroup from './RoomGroup';
import RoomMember from './RoomMember';

const channelIcon = {
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
  channels: Group[];
};

const RoomSidebar = ({ channels }: Props) => {
  const textGroups = channels.filter(channel => channel.type === GroupType.TEXT);
  const audioGroups = channels.filter(channel => channel.type === GroupType.AUDIO);
  const videoGroups = channels.filter(channel => channel.type === GroupType.VIDEO);
  const otherMembers = members.filter(member => member.profileId !== 'profile_1');
  const role = MemberRole.ADMIN;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <RoomHeader server={servers[0] as any} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <RoomSearch
            data={[
              {
                label: 'Text Groups',
                type: 'channel',
                data: textGroups?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: 'Voice Groups',
                type: 'channel',
                data: audioGroups?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: 'Video Groups',
                type: 'channel',
                data: videoGroups?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  // name: member.profile.name,
                  name: member.profileId,
                  icon: roleIcon[member.role as MemberRole],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textGroups?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='channels'
              channelType={GroupType.TEXT}
              role={role}
              label='Text Groups'
            />
            <div className='space-y-[2px]'>
              {textGroups.map(channel => (
                <RoomGroup
                  key={channel.id}
                  channel={channel as any}
                  role={role}
                  server={servers[0] as any}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioGroups?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='channels'
              channelType={GroupType.AUDIO}
              role={role}
              label='Voice Groups'
            />
            <div className='space-y-[2px]'>
              {audioGroups.map(channel => (
                <RoomGroup
                  key={channel.id}
                  channel={channel as any}
                  role={role}
                  server={servers[0] as any}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoGroups?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='channels'
              channelType={GroupType.VIDEO}
              role={role}
              label='Video Groups'
            />
            <div className='space-y-[2px]'>
              {videoGroups.map(channel => (
                <RoomGroup
                  key={channel.id}
                  channel={channel as any}
                  role={role}
                  server={servers[0] as any}
                />
              ))}
            </div>
          </div>
        )}
        {!!members?.length && (
          <div className='mb-2'>
            <GroupListSection
              sectionType='members'
              role={role}
              label='Members'
              server={servers[0] as any}
            />
            <div className='space-y-[2px]'>
              {otherMembers.map(member => (
                <RoomMember key={member.id} member={member as any} server={servers[0] as any} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RoomSidebar;

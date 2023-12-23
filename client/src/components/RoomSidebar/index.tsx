import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { Channel, ChannelType, MemberRole } from '@/lib/types';
import { channels, members, servers } from '@/lib/fakeData';
import RoomHeader from './RoomHeader';
import RoomSearch from './RoomSearch';
import ChannelListSection from './RoomSection';
import RoomGroup from './RoomGroup';
import RoomMember from './RoomMember';

const channelIcon = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

const roleIcon = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
};

type Props = {
  channels: Channel[];
};

const RoomSidebar = ({ channels }: Props) => {
  const textChannels = channels.filter(channel => channel.type === ChannelType.TEXT);
  const audioChannels = channels.filter(channel => channel.type === ChannelType.AUDIO);
  const videoChannels = channels.filter(channel => channel.type === ChannelType.VIDEO);
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
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
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
        {!!textChannels?.length && (
          <div className='mb-2'>
            <ChannelListSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              label='Text Channels'
            />
            <div className='space-y-[2px]'>
              {textChannels.map(channel => (
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
        {!!audioChannels?.length && (
          <div className='mb-2'>
            <ChannelListSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              label='Voice Channels'
            />
            <div className='space-y-[2px]'>
              {audioChannels.map(channel => (
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
        {!!videoChannels?.length && (
          <div className='mb-2'>
            <ChannelListSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              label='Video Channels'
            />
            <div className='space-y-[2px]'>
              {videoChannels.map(channel => (
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
            <ChannelListSection
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

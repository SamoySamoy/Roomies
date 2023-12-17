import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { Channel, ChannelType, Member, MemberRole } from '@/lib/types';
import { channels, members, servers } from '@/lib/fakeData';
import ChannelListHeader from './ChannelListHeader';
import ChannelListSearch from './ChanelListSearch';
import ChannelListSection from './ChannelListSection';
import ChannelListChannel from './ChannelListChannel';
import ChannelListMember from './ChannelListMember';

const iconMap: Record<ChannelType, React.ReactNode> = {
  text: <Hash className='mr-2 h-4 w-4' />,
  audio: <Mic className='mr-2 h-4 w-4' />,
  video: <Video className='mr-2 h-4 w-4' />,
};

const roleIconMap: Record<MemberRole, React.ReactNode> = {
  guest: null,
  moderator: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />,
  admin: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
};

const ChannelListSidebar = () => {
  const textChannels = channels.filter(channel => channel.type === 'text');
  const audioChannels = channels.filter(channel => channel.type === 'audio');
  const videoChannels = channels.filter(channel => channel.type === 'video');
  const otherMembers = members.filter(member => member.profileId !== 'profile_1');
  const role = 'admin';

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
      <ChannelListHeader server={servers[0] as any} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ChannelListSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type as ChannelType],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type as ChannelType],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type as ChannelType],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  // name: member.profile.name,
                  name: member.profileId,
                  icon: roleIconMap[member.role as MemberRole],
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
              // channelType={ChannelType.TEXT}
              channelType='text'
              role={role}
              label='Text Channels'
            />
            <div className='space-y-[2px]'>
              {textChannels.map(channel => (
                <ChannelListChannel
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
              // channelType={ChannelType.AUDIO}
              channelType='audio'
              role={role}
              label='Voice Channels'
            />
            <div className='space-y-[2px]'>
              {audioChannels.map(channel => (
                <ChannelListChannel
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
              // channelType={ChannelType.VIDEO}
              channelType='video'
              role={role}
              label='Video Channels'
            />
            <div className='space-y-[2px]'>
              {videoChannels.map(channel => (
                <ChannelListChannel
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
                <ChannelListMember
                  key={member.id}
                  member={member as any}
                  server={servers[0] as any}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChannelListSidebar;

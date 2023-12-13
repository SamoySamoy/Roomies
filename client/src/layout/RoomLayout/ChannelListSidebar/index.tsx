import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { Channel, ChannelType, Member, MemberRole } from '@/lib/types';
import { channels, members, servers } from '@/lib/fakeData';
import ChannelListHeader from './ChannelListHeader';

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
    </div>
  );
};

export default ChannelListSidebar;

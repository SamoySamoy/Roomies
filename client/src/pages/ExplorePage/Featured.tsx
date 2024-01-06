import { GroupType, Room, RoomType } from '@/lib/types';
import MemberAvatar from '@/components/MemberAvatar';
import { getFileUrl } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { User, Hash, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/useModal';

type FeaturedProps = {
  rooms: Room[];
};

const roomIntros = [
  "🌟 **Welcome to Our Dynamic Community!** 🌟 Dive into a world where connections flourish and friendships evolve. Our Discord server is an energetic hub for individuals seeking more than just a community; it's a thriving ecosystem of shared passions and diverse personalities.",
  'Embark on a gaming odyssey with like-minded enthusiasts! From strategic discussions on the latest releases to exhilarating multiplayer sessions, our gaming channels provide a haven for players seeking camaraderie and epic adventures. Join the ranks of dedicated gamers and forge bonds that transcend the virtual realm.',
  'Unleash your creativity in our vibrant artistic community! Writers, artists, musicians—everyone is embraced. Share your latest masterpieces, engage in collaborative projects, and immerse yourself in a supportive environment that values and celebrates the boundless expressions of creativity.',
  "🤝 **Harmony in Diversity: A Welcoming Oasis** 🤝 In our community, diversity isn't just accepted; it's celebrated. Mutual respect is the cornerstone of our foundation. Join a welcoming environment where open dialogue and positive interactions create a sense of belonging. Every voice is heard, every perspective valued.",
  "🔍 **Discover, Engage, Expand!** 🔍 Immerse yourself in a myriad of interest-based channels! Whether you're exploring the latest in tech, delving into scientific wonders, or staying ahead of fashion trends, our server is the platform to share your passions and discover new realms of interest.",
  '🎉 **Celebrate the Extraordinary: Events & Giveaways** 🎉 Elevate your experience with our regular events and thrilling giveaways! From engaging game nights to themed contests with enticing prizes, join the festivities as we celebrate together, creating memorable moments that last a lifetime.',
  '🌐 **Connect Globally, Bond Locally** 🌐 Our server transcends geographical boundaries, offering a global network of friends. Engage in enriching conversations with members from diverse cultures, broaden your perspectives, and establish connections that bridge continents.',
  "🚀 **Ready for an Unforgettable Journey?** 🚀 Immerse yourself in an unparalleled Discord experience by joining our community today! Click the invite link below, and step into a world where every interaction is an adventure. We're excited to welcome you—let the extraordinary journey commence!",
  "🛡️ **Guardians of Positivity: Our Community Pledge** 🛡️ Within our server, positivity isn't just encouraged; it's protected. We're committed to fostering an environment where encouragement and support thrive. Join us in building a haven that elevates everyone, ensuring every member feels valued and empowered.",
  '🎊 **A Decade of Friendship Awaits!** 🎊 Join our community today and become part of a legacy in the making. As we embark on this journey together, we look forward to creating stories, sharing laughter, and building friendships that will stand the test of time. Ready to make history? Join us now!',
];

const Featured = ({ rooms }: FeaturedProps) => {
  if (rooms.length === 0) {
    return <p className='font-bold text-4xl text-foreground my-auto mx-auto'>No room available</p>;
  }

  return (
    <div className='flex flex-col gap-y-4 m-2'>
      <div className='gap-y-2'>
        <p className='font-bold text-2xl text-foreground'>Featured Rooms</p>
        <p className='dark:text-slate-400/80 text-slate-600/80 text-sm'>
          Some awesome rooms we think you'd love
        </p>
      </div>

      {/* Cards*/}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-2 sm:gap-x-4 mb-4'>
        {rooms.map((room, i) => (
          <RoomCard key={room.id} room={room} index={i} />
        ))}
      </div>
    </div>
  );
};

type RoomCardProps = {
  room: Room;
  index: number;
};

export const RoomCard = ({ room, index }: RoomCardProps) => {
  const { openModal } = useModal();

  const textGroups = room.groups.filter(group => group.type === GroupType.TEXT);
  // const audioGroups = room.groups.filter(group => group.type === GroupType.AUDIO);
  const videoGroups = room.groups.filter(group => group.type === GroupType.VIDEO);
  const members = room.members;

  const onJoin = () => {
    if (room.type === RoomType.PUBLIC) {
      return openModal({
        modalType: 'joinPublicRoom',
        data: {
          room,
        },
      });
    }
    if (room.type === RoomType.PRIVATE) {
      return openModal({
        modalType: 'joinPrivateRoom',
        data: {
          room,
        },
      });
    }
  };

  return (
    <Card className='bg-[#E3E5E8] text-primary dark:bg-[#1E1F22] relative rounded-md drop-shadow-md'>
      <div className='relative'>
        <img src={getFileUrl(room.imageUrl)} className='rounded-md object-cover w-full h-[280px]' />
        <div className='absolute -bottom-4 left-4'>
          <MemberAvatar
            src={getFileUrl(room.profile.imageUrl)}
            fallback={
              <p className='text-foreground'>{room.profile.email.split('@')[0].slice(0, 2)}</p>
            }
            className='md:h-12 md:w-12'
          />
        </div>
      </div>
      <CardContent className='px-4 pt-6 pb-4'>
        <div className='flex items-center justify-between'>
          <p className='text-foreground font-bold text-lg'>{room.name}</p>
          <Button
            variant={'outline'}
            className='font-bold transition-all hover:scale-105'
            onClick={onJoin}
          >
            Join
          </Button>
        </div>
        <p className='dark:text-slate-400/80 text-slate-600/80 text-sm line-clamp-5 my-2'>
          {roomIntros[index % roomIntros.length]}
        </p>
      </CardContent>
      <CardFooter className='flex justify-between items-center px-4'>
        <div className='flex gap-3'>
          <div className='flex gap-1 items-center'>
            <User className='flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400' />
            {members.length}
          </div>
          <Badge variant={room.type === RoomType.PUBLIC ? 'public' : 'private'}>
            {room.type.toUpperCase()}
          </Badge>
        </div>
        <div className='flex gap-3'>
          {textGroups.length > 0 && (
            <div className='flex gap-1 items-center'>
              <Hash className='flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400' />
              {textGroups.length}
            </div>
          )}
          {/* {audioGroups.length > 0 && (
            <div className='flex gap-1 items-center'>
              <Mic className='flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400' />
              {audioGroups.length}
            </div>
          )} */}
          {videoGroups.length > 0 && (
            <div className='flex gap-1 items-center'>
              <Video className='flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400' />
              {videoGroups.length}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Featured;

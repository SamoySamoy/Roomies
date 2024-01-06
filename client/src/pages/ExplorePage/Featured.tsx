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

const Featured = ({ rooms }: FeaturedProps) => {
  "className='flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400'";
  return (
    <div className='flex flex-col gap-y-4 m-2'>
      {/* Titles */}
      <div className='gap-y-2'>
        <p className='font-bold text-2xl'>Featured Rooms</p>
        <p className='dark:text-slate-400/80 text-slate-600/80 text-sm'>
          Some awesome rooms we think you'd love
        </p>
      </div>

      {/* Cards*/}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-8 gap-x-2 sm:gap-x-4 mb-4'>
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

type RoomCardProps = {
  room: Room;
};

export const RoomCard = ({ room }: RoomCardProps) => {
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
    <Card className='bg-[#E3E5E8] text-primary dark:bg-[#1E1F22] relative rounded-b-[0.8rem] drop-shadow-md'>
      <div className='relative'>
        <img src={getFileUrl(room.imageUrl)} className='rounded-md object-cover w-full h-[250px]' />
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
        <p className='dark:text-slate-400/80 text-slate-600/80 text-sm line-clamp-4 mt-2'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita, fugiat? Quidem
          repudiandae quae obcaecati soluta cum, libero voluptatibus eius quos, iusto fugiat a
          nobis, ipsam illo nisi praesentium nostrum natus.
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

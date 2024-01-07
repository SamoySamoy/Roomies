import { useRef, useEffect } from 'react';
import { MicOff, Mic, Video, VideoOff, Pin, PinOff } from 'lucide-react';
import MemberAvatar from './MemberAvatar';
import { useAuth } from '@/hooks/useAuth';
import ActionTooltip from './ActionToolTip';
import { cn } from '@/lib/utils';

export type VideoProps = {
  stream: MediaStream | null;
  profileId: string;
  imageUrl: string;
  email: string;
} & (
  | {
      type: 'camera';
      cameraOn: boolean;
      micOn: boolean;
    }
  | {
      type: 'screen';
    }
);

export type ExtraProps = {
  onPinClick: (profileId: string) => void;
  pin?: boolean;
  className?: string;
};

const VideoCard = (props: VideoProps & ExtraProps) => {
  const { auth } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.stream;
    }
    // @ts-expect-error
  }, [props.stream, props.micOn, props.cameraOn]);

  const MicIcon = props.type === 'camera' && props.micOn ? Mic : MicOff;
  const VideoIcon = props.type === 'camera' && props.cameraOn ? Video : VideoOff;
  const PinIcon = Boolean(props.pin) ? PinOff : Pin;

  return (
    <div
      className={cn(
        'w-[300px] gap-y-4 md:flex-1 bg-[#E3E5E8] dark:bg-[#1E1F22] relative flex md:flex-row flex-col items-center justify-center rounded-lg shadow-md shadow-slate-800/30 dark:shadow-slate-200/10',
        props.className,
      )}
    >
      {props.type === 'screen' && (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className='h-full w-full object-cover rounded-2xl'
        />
      )}
      {props.type === 'camera' && props.cameraOn && (
        <video
          ref={videoRef}
          muted={auth.profileId === props.profileId ? true : !props.micOn}
          autoPlay
          playsInline
          className='h-full w-full object-cover rounded-2xl'
        />
      )}
      {props.type === 'camera' && !props.cameraOn && (
        <>
          <MemberAvatar
            src={props.imageUrl}
            fallback={<p>{props.email.split('@')[0].slice(0, 2)}</p>}
            className='sm:w-[70px] md:w-[110px] lg:w-[150px] sm:h-[70px] md:h-[110px] lg:h-[150px] rounded-full'
          />
          <video
            ref={videoRef}
            muted={auth.profileId === props.profileId ? true : !props.micOn}
            autoPlay
            playsInline
            className='h-0 w-0 object-cover rounded-2xl'
          />
        </>
      )}

      <div className='gap-y-2 md:absolute top-4 right-4 flex flex-col md:flex-row items-center justify-between cursor-pointer'>
        <ActionTooltip side='top' label={'Pin this video'}>
          <div className='bg-white/80 dark:bg-black p-2 rounded-lg'>
            <PinIcon onClick={() => props.onPinClick(props.profileId)} />
          </div>
        </ActionTooltip>
      </div>

      <div className='gap-y-2 md:absolute z-10 bottom-4 inset-x-4 flex flex-col md:flex-row items-center justify-between'>
        <p
          className={cn(
            'font-bold text-sm bg-white/80 text-dark dark:bg-black dark:text-white px-2 py-1 rounded-lg',
          )}
        >
          {props.email}
        </p>
        {props.type === 'camera' && (
          <div className='flex items-center gap-x-4 bg-white/80 dark:bg-black p-2 rounded-lg'>
            <MicIcon className='w-6 h-6 text-black dark:text-white' />
            <VideoIcon className='w-6 h-6 text-black dark:text-white' />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;

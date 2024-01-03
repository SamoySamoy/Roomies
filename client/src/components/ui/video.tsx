import { useRef, useState, useEffect } from 'react';
import { MicOff, Mic } from 'lucide-react';

type VideoProps = {
  stream: MediaStream;
  profileId: string;
  imageUrl: string;
  email: string;
  mic: boolean;
  camera: boolean;
};

const Video = ({ stream, profileId, mute }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  let mic;
  if (mute) {
    mic = <MicOff className='absolute bottom-1 left-1' size={20}></MicOff>;
  } else {
    mic = <Mic className='absolute bottom-1 left-1' size={20}></Mic>;
  }

  return (
    <div className='flex-1 basis-1/4'>
      <div className='relative'>
        {mic}
        <span className='absolute bottom-1 left-10 text-base'>{profileId}</span>
        <video
          className='w-full h-full rounded-md'
          ref={videoRef}
          autoPlay
          playsInline
          muted={mute}
        ></video>
      </div>
    </div>
  );
};

export default Video;

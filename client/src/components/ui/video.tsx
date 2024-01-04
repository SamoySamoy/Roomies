import { useRef, useState, useEffect } from 'react';
import { MicOff, Mic } from 'lucide-react';

export type VideoProps = {
  stream: MediaStream;
  profileId: string;
  imageUrl: string;
  email: string;
  micOn: boolean;
  cameraOn: boolean;
};

const Video = ({ stream, profileId, imageUrl, email, micOn, cameraOn }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  let microphone;
  if (micOn) {
    microphone = <MicOff className='absolute bottom-1 left-1' size={20}></MicOff>;
  } else {
    microphone = <MicOff className='absolute bottom-1 left-1' size={20}></MicOff>;
  }

  return (
    <div className='flex-1 basis-1/4'>
      <div className='relative'>
        {microphone}
        <span className='absolute bottom-1 left-10 text-base'>{profileId}</span>
        <video
          className='w-full h-full rounded-md'
          ref={videoRef}
          autoPlay
          playsInline
        ></video>
      </div>
    </div>
  );
};

export default Video;

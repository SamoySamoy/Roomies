import { useState } from 'react';
import Video, { VideoProps } from '@/components/VideoCard';
import VideoButton from '@/components/CameraButton';
import MicButton from '@/components/MicButton';
import ShareScreenButton from '@/components/ShareScreenButton';
import PhoneButton from '@/components/PhoneButton';
import { faker } from '@faker-js/faker';

const genFakeCameraData = (): VideoProps => ({
  stream: null,
  type: 'camera',
  profileId: faker.string.alphanumeric({
    length: 20,
  }),
  cameraOn: Boolean(Math.round(Math.random())),
  micOn: Boolean(Math.round(Math.random())),
  email: faker.internet.email(),
  imageUrl: faker.image.urlPicsumPhotos({
    width: 200,
    height: 200,
  }),
});
const genFakeScreenData = (): VideoProps => ({
  stream: null,
  type: 'screen',
  profileId: faker.string.alphanumeric({
    length: 20,
  }),
  email: faker.internet.email(),
  imageUrl: faker.image.urlPicsumPhotos({
    width: 200,
    height: 200,
  }),
});

const MAX_VIDEO_PER_ROW = 4;
const ITEM_LIMIT = 15;

const genFakeVideoProps = () => {
  const videoProps: VideoProps[][] = [];
  for (let i = 0; i < ITEM_LIMIT; i++) {
    const yes = Boolean(Math.round(Math.random()));
    const item = yes ? genFakeCameraData() : genFakeScreenData();
    if (
      videoProps.length === 0 ||
      videoProps[videoProps.length - 1].length % MAX_VIDEO_PER_ROW === 0
    ) {
      videoProps.push([item]);
    } else {
      videoProps[videoProps.length - 1].push(item);
    }
  }
  return videoProps;
};

const AudioPage = () => {
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [shareScreenOn, setShareScreenOn] = useState(false);

  const [videoGrid] = useState<VideoProps[][]>(genFakeVideoProps());

  // const addVideo = (newVid: VideoProps) => {};

  // const removeVideo = (id: string) => {};

  const clickCamera = () => {
    setCameraOn(prev => !prev);
  };

  const clickMic = () => {
    setMicOn(prev => !prev);
  };

  const clickShareScreen = () => {
    setShareScreenOn(prev => !prev);
  };

  const onEndCall = () => {};

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full group relative px-4 py-2'>
      <div className='flex-1 flex flex-col gap-y-4 overflow-y-auto'>
        {videoGrid.map((row, i) => {
          return (
            <div className='flex flex-col gap-y-1 md:flex-row md:gap-x-4 items-center' key={i}>
              {row.map(col => (
                <Video key={col.profileId} {...col} onPinClick={() => {}} />
              ))}
            </div>
          );
        })}
      </div>
      <div className='absolute inset-x-0 mx-auto bottom-10 opacity-0 flex translate-y-[100px] group-hover:translate-y-0 group-hover:opacity-1 group-hover:opacity-100 item-center justify-center gap-x-6 transition-all duration-500'>
        <VideoButton on={cameraOn} onClick={clickCamera} />
        <MicButton on={micOn} onClick={clickMic} />
        <ShareScreenButton on={shareScreenOn} onClick={clickShareScreen} />
        <PhoneButton on={false} onClick={onEndCall} />
      </div>
    </div>
  );
};

export default AudioPage;

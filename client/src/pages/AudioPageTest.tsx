import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import Video from '@/components/ui/video';
import { useParams } from 'react-router-dom';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { VideoProps } from '@/components/ui/video';
import ChatVideoButton from '@/components/Chat/ChatVideoButton';
import MicButton from '@/components/MicButton';
import ShareScreenButton from '@/components/ShareScreenButton';

/* 

Lưu redis (1 biến): lưu được có bao nhiều thằng đang online ở cái group này
(profleId, email, imageUrl, cameraOn: true, micOn, screenOn)

const fakeRedis = {
  "groupId": [{
    type: "camera" profleId, email, imageUrl, cameraOn: true, micOn, screenOn
    type: "screen" profleId, email, imageUrl, cameraOn: true, micOn, screenOn
  }]
}

Client nhìn thấy UI:
  - Vào là tắt hết: 
  - Vẫn nhìn list nguiowf dùng khác

useEffect(): chạy coonnect peer hết

Khi 1 thằng sahre camera -> socket server -> socket những thằng còn lại
Vì ở bên duows connect (ready), video.mute = true

2 steam: 1 stream mic cả video  - luôn duy trì
        1 stream share màn -> Ngắt được

2 steam: 1 stream mic cả video  - Ngắt được
        1 stream share màn -> Ngắt được video.stop(); nếu tạo peer mới 


share, mic, camera , join , leave -> socket

join -> nhận được danh sách trạng thái

Mới vào gọi trong room

*/

const AudioPage = () => {
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };

  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [shareScreenOn, setShareScreenOn] = useState(false);

  const [peopleInGroup] = useState('Danh sachs trn server');

  const [videoList, setVideoList] = useState<VideoProps[]>([]);

  /* 
  videoList = [][]

  1 ROW co toi da bao nhieu video

  [[video, video, video], [video, video, video], [videoMoi]]


  <div class="flex flex-col">
  <div class="flex-1 flex flex-row">
    <div class="flex-1">
    <div class="flex-1">
    <div class="flex-1">
  </div>
  <div class="flex-1 "></div>
  <div>

  Nut add them video,

  {
    <div class="flex ">
    videoList2chieu.map(videoListAraaycon => {
      <div class="flex flex -1">
      videoListAraya.con(video => <div class="flex-1">...)
    })
    <div>
  }

  */

  const [canShareScreen, setCanShareScreen] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream>();

  const myVideo = useRef<HTMLVideoElement>(null);
  let callList: Map<string, MediaConnection> = new Map<string, MediaConnection>();

  const addVideo = (newVid: VideoProps) => {
    setVideoList(prevVideoList => [...prevVideoList, newVid]);
  };

  const removeVideo = (id: string) => {
    setVideoList(prev => prev.filter(video => video.peerId !== id));
  };

  const clickCamera = () => {
    setCameraOn(prev => !prev);
    // socket.emit('camera-off', peerId);
    const videoTrack = localStream?.getTracks().find(track => {
      console.log('Get track');
      console.log(track);
      return track.kind === 'video';
    });
    if (videoTrack) {
      // videoTrack.stop();
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  function clickMic() {}

  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: {
          noiseSuppression: true,
        },
        video: true,
      })
      .then(function (stream) {
        addVideo({
          peerId: 'screen',
          mute: true,
          stream,
        });
      });
    setCanShareScreen(false);
  }

  useEffect(() => {
    let peer: Peer;
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          noiseSuppression: true,
        },
        video: true,
      })
      .then(function (stream) {
        if (myVideo.current != null) {
          myVideo.current.srcObject = stream;
          myVideo.current.muted = true;
          myVideo.current.play();
        }
        setLocalStream(stream);
        addVideo({ peerId: auth.profileId!, mute: true, stream });

        // peer = new Peer(origin.profileId, {
        //   host: '/',
        //   port: 3001
        // });
        peer = new Peer(origin.profileId);

        peer.on('open', id => {
          console.log('peer opened');
          socket.emit('client:peer:init:success', origin);
          console.log(id);
          console.log(peer);
        });

        peer.on('call', function (call) {
          console.log(call.peer + ' is calling');
          call.answer(stream);
          call.once('stream', function (callerStream) {
            addVideo({ peerId: call.peer, mute: false, stream: callerStream });
            // otherVid.current!.srcObject=callerStream;
          });
          callList.set(call.peer, call);
        });

        socket.on('server:peer:init:success', id => {
          if (peer.open) {
            console.log(id + ' just joined, i will call him');
            const call = peer.call(id, stream);
            console.log(call);
            call.once('stream', function (otherStream) {
              console.log('the other responsed');
              console.log(stream.id);
              addVideo({ peerId: call.peer, mute: true, stream: otherStream });
            });
            call.on('close', function () {
              removeVideo(call.peer);
              console.log('remove the id on close: ' + call.peer);
            });

            callList.set(call.peer, call);
          } else {
            console.log('Peer have not ready!');
          }
        });
      })
      .catch(function (err) {
        console.log(err);
      });
    socket.on('server:user-disconnected', function (id) {
      console.log('received user disconnected: ' + id);
      console.log(callList);
      if (callList.has(id)) {
        callList.get(id)!.close();
        callList.delete(id);
      }
      console.log(videoList);
      // removeVideo(id);
    });

    socket.on('server:room:leave:success', function (msg) {
      let leaveId = msg.split(' ')[1];
      console.log(leaveId + ' just leave the room to get to the text');
    });
    return function () {
      socket.emit('client:room:leave', origin, {
        email: auth.email!,
      });
      console.log('clean up group');
      peer.destroy();
    };
  }, []);

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      {/* <Button className='bg-lime-600 mx-1'>
        Camera is {camera}
      </Button>
      <Button className='bg-lime-600' onClick={shareScreen} disabled={!canShareScreen}>
        Share Screen
      </Button> */}
      <div className='flex flex-row flex-wrap gap-1 m-1'>
        {videoList.map(function (video) {
          return (
            <Video
              key={video.peerId}
              mute={video.mute}
              stream={video.stream}
              peerId={video.peerId}
            />
          );
        })}
      </div>
      <span>{videoList.length}</span>
      <div className='flex items-center justify-center space-x-4'>
        <span onClick={clickCamera} className='inline-block'>
          <ChatVideoButton />
        </span>
        <span onClick={clickMic} className='inline-block'>
          <MicButton />
        </span>
        <span onClick={shareScreen} className='inline-block'>
          <ShareScreenButton />
        </span>
      </div>
    </div>
  );
};

export default AudioPage;

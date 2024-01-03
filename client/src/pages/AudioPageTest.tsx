import { useEffect, useRef, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import Video from '@/components/VideoCard';
import { useParams } from 'react-router-dom';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { VideoProps } from '@/components/VideoCard';
import ChatVideoButton from '@/components/ChatVideoButton';
import MicButton from '@/components/MicButton';
import ShareScreenButton from '@/components/ShareScreenButton';
import { VideoOff } from 'lucide-react';

/* 

Lưu redis (1 biến): Lưu trạng thái có bao nhiêu người dùng có trong meeting, trạng thái của họ

MeetingState: type: "camera", profleId, email, imageUrl, cameraOn: true, micOn, screenOn
MeetingState: type: "screen", profleId, email, imageUrl

const fakeRedis = {
  "groupId": {
    `profileId-type`: {...MeetingState}
  }
}

Mới join:
  Client nhìn thấy (UI):
    - Mới join là tắt hết cam, mic, share screen: 
    - Vẫn nhìn list người dùng khác, nhìn được camera mic của người dùng còn lại nếu họ bật
  useEffect(): chạy ngầm để connect các peer còn lại
  
  B1: Người dùng mới join sẽ socket trạng thái lên server (client:meeting:join)
  B2: Server cập nhật trạng thái redis
  B3: Emit toàn bộ danh sách trạng thái cho người mới join
  B4: Emit 1 trạng thái mới (hoặc toàn bộ danh sách trạng thái mới) join cho phần còn lại
  B5: Người mới join sau khi nhận được toàn bộ trạng thái. Thực hiện call cho phần còn lại
  B6: Phần còn lại nhận call từ người mới vào -> Accpect thành công -> cập nhật video list và render
  
Leave:
  B1: 1 người dùng leave (client:meeting:leave) sẽ socket trạng thái lên server
  B2: server cập nhật trạng thái redis
  B3: Broadcast toàn bộ danh sách mới cho phần còn lại
  B4: Phần còn lại nhận được danh sách mới, thực hiện so sánh danh sách mới và videoList. Cái nào thừa thì cắt và render

Camera, mic:
  B1: Người dùng bật / tắt camera /mic socket lên server (client:meeting:camera / client:meeting:mic)
  B2: Server cập nhật danh sách
  B3: Gửi lại toàn bộ danh sách mới cho toàn group (kể cả người thực hiện hành động)

Turn on share screen:
  B1: Tạo thằng peer mới
  B2: socket cập nhật trạng thái redis
  B3: Gửi lại danh sách mới cho toàn bộ (kể cả người share)
  B4: Render share screen của mình
  B5: Call tới phần còn lại trong danh sách
  B6: Phần còn lại accept thành công. Khớp danh sách vừa cập nhật và (videoProps + call.peer) -> render

Turn off share screen:
  B1: socket cập nhật redis
  B2: Gửi lại danh sách mới cho toàn bộ (kể cả người share)
  B3: Phần còn lại sẽ xóa render (nhưng vẫn còn call)
  B4: Mình xóa render, Peer.destroy, kill stream
  B5: Bên phía phần còn lại sẽ nhận được sử kiện call.on("close"). Khớp danh sách vừa cập nhật và (call.peer list) -> render

2 stream:
  1 stream mic cả video  - luôn duy trì
  1 stream share màn -> Ngắt được

Có thể sử dụng 3 state là 3 array:
  - meetingStates: Đây là danh sách trạng thái nhận được từ phía server
  - peerInCall: Đây là danh sách peer thực sự có kết nối (VD: peerInCall = [{ peerId(profileId): string, stream: MediaStream}])
  - videoList là khớp giữa meetingStates và peerInCall. meetingState được cập nhật từ server socket nên có thể được cập nhật nhanh hơn. peerInCall là danh sách các peer thực sự đang có kết nối nên cập nhật chậm hơn. Chỉ thực hiện render các peer có trong cả meetingState và  peerInCall. videoList.length = min(peerInCall.length, meetingStates.length)

*/

type PeopleInMeeting = {
  profileId: string;
  email: string;
  imageUrl: string;
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

  const [peerOnConnect, setPeerOnConnect] = useState<{ peerId: string; stream: MediaStream }[]>([]);
  // Bị gọi thì thêm stream của thằng gọi
  // Thằng gọi được trả lời, thì cũng thêm vào đây
  const [meetingStates, setMeetingStates] = useState<PeopleInMeeting[]>([]);
  // State có bao nhiêu thằng trong phòng

  const [videoList, setVideoList] = useState<VideoProps[][]>([]);

  // Tìm kiếm xem thằng nào có cả 2
  // meetingState: type, email, imageUrl
  // peer: stream

  // Camera - profileId
  // Share screen - uuid

  /* 
  
  "profileId": {
    "profileId"

  }

  "uuid": {
    profileId:
    type: screen
  }
  */

  /* 
  meetn
  */

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
      // Tắt mic hay tắt video đều dùng videoTrack.enabled = true / false
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  function clickMic() {}

  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: {
          noiseSuppression: true,
          echoCancellation: true,
          sampleRate: 44100,
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

        // A va B

        peer.on('call', function (call) {
          console.log(call.peer + ' is calling');
          call.answer(stream);
          call.once('stream', function (callerStream) {
            addVideo({ peerId: call.peer, mute: false, stream: callerStream });
            // otherVid.current!.srcObject=callerStream;
          });
          callList.set(call.peer, call);
          call.on('close', () => {});
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
              profileId={video.peerId}
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

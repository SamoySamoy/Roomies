import { useEffect, useRef, useState } from 'react';
import Video from '@/components/ui/video';
import { Button } from '@/components/ui/button';
import Peer, { MediaConnection } from 'peerjs';
import { useParams } from 'react-router-dom';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { fa, vi } from '@faker-js/faker';
import { VideoProps } from '@/components/ui/video';
import { CallTracker } from 'assert';

const AudioPage = () => {
  const [videoList, setVideoList] = useState<VideoProps[]>([]);
  const [camera, setCamera] = useState('on');
  const myVideo = useRef<HTMLVideoElement>(null);
  const [canShareScreen, setCanShareScreen] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  let callList: Map<string, MediaConnection> = new Map<string, MediaConnection>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };
  useEffect(() => {
    let peer: Peer;
    console.log('join room');
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        if (myVideo.current != null) {
          myVideo.current.srcObject = stream;
          myVideo.current.muted = true;
          myVideo.current.play();
        }
        setLocalStream(stream);
        // myVid.current!.srcObject = stream;
        console.log(stream);
        console.log(localStream);
        addVideo(auth.profileId!, true, stream);

        // peer = new Peer(origin.profileId, {
        //   host: '/',
        //   port: 3001
        // });
        peer = new Peer(origin.profileId);

        peer.on('call', function (call) {
          console.log(call.peer + ' is calling');
          call.answer(stream);
          call.once('stream', function (callerStream) {
            addVideo(call.peer, false, callerStream);
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
              addVideo(call.peer, true, otherStream);
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
        peer.on('open', id => {
          console.log('peer opened');
          socket.emit('client:peer:init:success', origin);
          console.log(id);
          console.log(peer);
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

  useEffect(() => {
    console.log('list updated: ');
    console.log(videoList);
  }, [videoList]);

  function addVideo(peerId: string, mute: boolean, stream: MediaStream) {
    const newVid = { peerId: peerId, mute: mute, stream: stream };
    setVideoList(prevVideoList => [...prevVideoList, newVid]);
  }

  function removeVideo(id: string) {
    // console.log(videoList);
    // let newVidList = videoList.filter(video => video.peerId !== id);
    // console.log('After remove');
    // console.log(newVidList);
    // setVideoList(newVidList)
    setVideoList(prev => prev.filter(video => video.peerId !== id));
  }

  function clickCamera() {
    if (camera === 'on') setCamera('off');
    else setCamera('on');
    // socket.emit('camera-off', peerId);
    const videoTrack = localStream?.getTracks().find(track => track.kind === 'video');
    if (videoTrack) videoTrack.enabled = !videoTrack.enabled;
  }
  function shareScreen() {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then(function (stream) {
        addVideo('screen', true, stream);
      });
    setCanShareScreen(false);
  }
  return (
    <div className='grid-cols-3 auto-rows-auto bg-slate-500 h-lvh min-w-fit'>
      <Button className='bg-lime-600 mx-1' onClick={clickCamera}>
        Camera is {camera}
      </Button>
      <Button className='bg-lime-600' onClick={shareScreen} disabled={!canShareScreen}>
        Share Screen
      </Button>
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
    </div>
  );
};

export default AudioPage;

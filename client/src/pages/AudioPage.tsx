import { useEffect, useRef, useState } from 'react';
import Video from '@/components/ui/video';
import { Button } from '@/components/ui/button';
import Peer, { MediaConnection } from 'peerjs';
import { useParams } from 'react-router-dom';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { fa, ne, tr, vi } from '@faker-js/faker';
import { VideoProps } from '@/components/ui/video';
import { CallTracker } from 'assert';
import ActionTooltip from '@/components/ActionToolTip';
import ChatVideoButton from '@/components/Chat/ChatVideoButton';
import MicButton from '@/components/MicButton';
import ShareScreenButton from '@/components/ShareScreenButton';
// import { PeopleInMeeting } from '@/lib/socket';
import { flushSync } from 'react-dom';

type MeetingState = {
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

type MeetingStateIdentity = Pick<MeetingState, 'profileId' | 'type'>;

const AudioPage = () => {
  const { auth } = useAuth();
  // const [meetingStates, setMeetingStates] = useState<PeopleInMeeting[]>([]);
  let localMeetingStates: MeetingState[] = [];
  // const [peerOnConnect, setPeerOnConnect] = useState<Map<string, MediaConnection>>(new Map());
  let peerOnConnect: Map<string, MediaConnection> = new Map();
  const [videoList, setVideoList] = useState<VideoProps[]>([]);
  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [shareScreen, setShareSceen] = useState<boolean>(false);
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };
  // const myVideo = useRef<HTMLVideoElement>(null);

  let localStream: MediaStream;


  // let callList: Map<string, MediaConnection> = new Map<string, MediaConnection>();

  useEffect(() => {
    let peer: Peer = new Peer(origin.profileId);
    peer.on('open', () => {
      let meetingState: MeetingState = {
        profileId: origin.profileId,
        email: auth.email!,
        imageUrl: auth.imageUrl!,
        type: 'camera',
        micOn: false,
        cameraOn: false
      }
      socket.emit('client:meeting:join', origin, meetingState);
      console.log(peer.connections);
    });

    function syncVideoListState(videoList: VideoProps[], meetingStates: MeetingState[]) {
      console.log(videoList);
      let newVideoList = [];
      for (let i = 0; i < videoList.length; i++) {
        //Find  the state
        let profileId = videoList[i].profileId;
        let stateIndex = -1;
        for (let j = 0; j < meetingStates.length; j++) {
          if (meetingStates[i].profileId === profileId) {
            stateIndex = j;
            break;
          }
        }

        //Sync the state to vidList
        let meetingState = meetingStates[stateIndex];
        if (meetingState.type === 'camera') {
          let newVideoProps: VideoProps = {
            stream: videoList[i].stream,
            profileId: profileId,
            email: meetingState.email,
            imageUrl: meetingState.imageUrl,
            cameraOn: meetingState.cameraOn,
            micOn: meetingState.micOn
          }
          newVideoList.push(newVideoProps);
        }

        if (newVideoList.length !== videoList.length) console.log('Sync video list problem');

        setVideoList(newVideoList);
      }
    }

    socket.on('server:meeting:state', (meetingStates) => {
      // setMeetingStates(meetingStates);
      console.log('update');
      localMeetingStates = meetingStates;
      console.log(meetingStates);
      console.log(peerOnConnect);
      console.log(videoList);
      
      // let newVideoList = videoList.filter((video) => {
      //   peerOnConnect.has(video.profileId) || video.profileId === origin.profileId;
      // });
      let newVideoList = videoList.filter((video) => {
        for (let i = 0; i < meetingStates.length; i++) {
          if (meetingStates[i].profileId === video.profileId) {
            return true;
          }
        }
        return false;
      });
      // let myState = meetingStates.filter(state => state.profileId === auth.profileId)[0];
      // // const myVideoProp: VideoProps ={
      // //   email: auth.email!,
      // //   cameraOn: cameraOn,
      // //   micOn: micOn,
      // //   imageUrl: auth.imageUrl!,
      // //   stream: myState.
      // // }
      // newVideoList.push(videoList.filter(video => video.profileId === auth.profileId!)[0]);
      console.log('New video length:' + newVideoList.length);
      syncVideoListState(newVideoList, meetingStates);
    });


    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        // stream.getTracks().forEach(track => track.enabled = !track.enabled);
        localStream = stream;
        
        console.log(stream);
        console.log(localStream);

        addVideo(localStream, auth.profileId!, auth.imageUrl!, auth.email!, false, false);

        socket.on('server:meeting:join:success', (meetingStates) => {
          // setMeetingStates(meetingStates);
          localMeetingStates = meetingStates;
          //Call những thằng nằm trong meetingStates mới nhận được.
          console.log(meetingStates);
          meetingStates.forEach((meetingState) => {
            if (meetingState.profileId !== origin.profileId) {
              let otherId = meetingState.profileId;
              try {
                let call = peer.call(otherId, stream);
                console.log('Calling: ' + otherId);
              call.once('stream', (otherStream) => {
                addPeerOnConnect(otherId, call);
                console.log('Receive answer from: ' + otherId);
                let otherIndexState = 0;
                for (let i = 0; i < localMeetingStates.length; i++) {
                  if (localMeetingStates[i].profileId === otherId) {
                    otherIndexState = i;
                    break;
                  }
                }
                console.log(localMeetingStates);
                let callerState = localMeetingStates[otherIndexState];
                if (callerState.type === 'camera') addVideo(otherStream, callerState.profileId, 
                  callerState.imageUrl, callerState.email, callerState.micOn, callerState.cameraOn);

                  call.on('close', () => {
                    console.log('second user removing: ' + otherId);
                    removeVideo(otherId);
                    removePeerOnConnect(otherId);
                  });
              });
              } catch (err) {
                console.log(err);
              }
              

              
            }


          })
        });

        peer.on('call', (call) => {
          let callerId = call.peer;
          call.answer(stream);
          call.once('stream', (callerStream) => {
            console.log('Receive stream from caller:' + callerId);

            let callerStateIndex = 0;
            for (let i = 0; i < localMeetingStates.length; i++) {
              if (localMeetingStates[i].profileId === callerId) {
                callerStateIndex = i;
                break;
              }
            }
            console.log(localMeetingStates);
            let callerState = localMeetingStates[callerStateIndex];

            addPeerOnConnect(callerId, call);
            if (callerState.type === 'camera') addVideo(callerStream, callerState.profileId, callerState.imageUrl, callerState.email, callerState.micOn, callerState.cameraOn);
          });
          call.on('close', () => {
            console.log('the first user remove: ' + callerId);
            removePeerOnConnect(callerId);
            removeVideo(callerId);
            console.log( peerOnConnect);
          })
        });


        // peer.on('call', function (call) {
        //   let callerId = call.peer;
        //   let videoState = meetingState.filter(people => people.profileId === callerId && people.type === 'camera')[0];
        //   console.log(call.peer + ' is calling');
        //   call.answer(stream);
        //   call.on('stream', function (callerStream) {
        //     addVideo(stream, callerId, videoState.imageUrl, videoState.email, videoState.);
        //     // otherVid.current!.srcObject=callerStream;
        //   });
        //   callList.set(call.peer, call);
        // });

        // socket.on('server:peer:init:success', id => {
        //   if (peer.open) {
        //     console.log(id + ' just joined, i will call him');
        //     const call = peer.call(id, stream);
        //     console.log(call);
        //     call.once('stream', function (otherStream) {
        //       console.log('the other responsed');
        //       console.log(stream.id);
        //       addVideo(call.peer, true, otherStream);
        //     });
        //     call.on('close', function () {
        //       removeVideo(call.peer);
        //       console.log('remove the id on close: ' + call.peer);
        //     });

        //     callList.set(call.peer, call);
        //   } else {
        //     console.log('Peer have not ready!');
        //   }
        // });
        // peer.on('open', id => {
        //   console.log('peer opened');
        //   socket.emit('client:peer:init:success', origin);
        //   console.log(id);
        //   console.log(peer);
        // });
      })
      .catch(function (err) {
        console.log(err);
      });
    // socket.on('server:user-disconnected', function (id) {
    //   console.log('received user disconnected: ' + id);
    //   console.log(callList);
    //   if (callList.has(id)) {
    //     callList.get(id)!.close();
    //     callList.delete(id);
    //   }
    //   console.log(videoList);
    //   // removeVideo(id);
    // });

    socket.on('server:room:leave:success', function (msg) {
      let leaveId = msg.split(' ')[1];
      console.log(leaveId + ' just leave the room to get to the text');
    });
    return function () {
      let identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
      socket.emit('client:meeting:leave', origin, identity);
      console.log('clean up group');
      peerOnConnect.forEach((call) => {
        call.close();
      });
      localStream.getTracks().forEach(track => track.stop());
      peer.destroy();
    };
  }, []);

  useEffect(() => {
    console.log('list updated: ');
    console.log(videoList);
  }, [videoList]);

  function addVideo(stream: MediaStream, profileId: string, imageUrl: string, email: string, mic: boolean, camera: boolean) {
    const newVid: VideoProps = { profileId: profileId, email: email, cameraOn: camera, micOn: mic, imageUrl: imageUrl, stream: stream };
    setVideoList(prevVideoList => [...prevVideoList, newVid]);
  }

  function removeVideo(id: string) {
    setVideoList(prev => prev.filter(video => video.profileId !== id));
  }

  function addPeerOnConnect(id: string, call: MediaConnection) {
    // let newPeerOnConnect = new Map(peerOnConnect);
    // newPeerOnConnect.set(id, call);
    // setPeerOnConnect(newPeerOnConnect);
    peerOnConnect.set(id, call);
  }

  function removePeerOnConnect(id: string) {
    // let newPeerOnConnect = new Map(peerOnConnect);
    // newPeerOnConnect.delete(id);
    // setPeerOnConnect(newPeerOnConnect);
    peerOnConnect.delete(id);
  }

  function clickCamera() {
    // const videoTracks = localStream.getVideoTracks();
    // videoTracks.forEach(videoTrack => videoTrack.enabled = !cameraOn);
    if (cameraOn) setCameraOn(false);
    else setCameraOn(true);
    // socket.emit('camera-off', peerId);
    let identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
    socket.emit('client:meeting:camera', origin, identity);
    
  }
  function clickMic() {
    console.log(localStream);
    // const audioTracks = localStream.getAudioTracks();
    // audioTracks.forEach(audioTrack => audioTrack.enabled = !micOn);
    if (micOn) setMicOn(false);
    else setMicOn(true);
    let identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
    socket.emit('client:meeting:mic', origin, identity);

   }
  // function shareScreen() {
  //   navigator.mediaDevices
  //     .getDisplayMedia({
  //       audio: true,
  //       video: true,
  //     })
  //     .then(function (stream) {
  //       addVideo('screen', true, stream);
  //     });
  //   setCanShareScreen(false);
  // }
  return (
    <div className='grid-cols-3 auto-rows-auto bg-slate-500 h-lvh min-w-fit'>
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
              key={video.profileId}
              micOn={video.micOn}
              stream={video.stream}
              profileId={video.profileId}
              imageUrl={video.imageUrl}
              cameraOn={video.cameraOn}
              email={video.email}
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
        <span className='inline-block'>
          <ShareScreenButton />
        </span>
      </div>
    </div>
  );
};

export default AudioPage;

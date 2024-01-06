import { useEffect, useRef, useState } from 'react';
import Video from '@/components/VideoCard';
import { Button } from '@/components/ui/button';
import Peer, { MediaConnection } from 'peerjs';
// import { Peer } from "peerjs";
import { useNavigate, useParams } from 'react-router-dom';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
// import { fa, id_ID, ro, vi } from '@faker-js/faker';
import { fa, id_ID, ro, vi } from '@faker-js/faker';
import { VideoProps } from '@/components/VideoCard';
import { CallTracker } from 'assert';
import ActionTooltip from '@/components/ActionToolTip';
// import ChatVideoButton from '@/components/ChatVideoButton';
import MicButton from '@/components/MicButton';
import ShareScreenButton from '@/components/ShareScreenButton';
// import { PeopleInMeeting } from '@/lib/socket';
import VideoButton from '@/components/CameraButton';
import PhoneButton from '@/components/PhoneButton';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';

/* 
1. Kill local screen stream, local sreen peer
2. useEffect cho videoGrid,
  useEffect(() => ..., [localMeetingStates, peerOnConnect])
3. Chuyển sang dùng map cho peerOnConnect và localMeetingStates


function a() {
  const obj = {};
  const profileId: string = '';
  if (!obj[profileId]) {
    return;
  }

  Object.values(obj) = [""];
  Object.keys(obj)= [""]

  delete obj[profileId];
}

*/

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

const MAX_VIDEO_PER_ROW = 4;
const ITEM_LIMIT = 27;

const AudioPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };

  // const [meetingStates, setMeetingStates] = useState<PeopleInMeeting[]>([]);
  // const [peerOnConnect, setPeerOnConnect] = useState<Map<string, MediaConnection>>(new Map());
  const localMeetingStates = useRef<Record<string, MeetingState>>({});
  const peerOnConnect = useRef(new Map<string, MediaConnection>());
  const [useStateLocalMeetingStates, setUseStateLocalMeetingStates] = useState<
    Record<string, MeetingState>
  >({});
  const [videoGrid, setVideoGrid] = useState<VideoProps[][]>([]);

  const [cameraOn, setCameraOn] = useState<boolean>(false);
  const [micOn, setMicOn] = useState<boolean>(false);
  const [shareScreenOn, setShareScreenOn] = useState<boolean>(false);

  const localStream = useRef<MediaStream>();
  const peer = useRef<Peer>();
  const localScreenStream = useRef<MediaStream>();
  const screenPeer = useRef<Peer>();
  const screenId = useRef<string>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        peer.current = new Peer(origin.profileId);
        peer.current.on('open', () => {
          let meetingState: MeetingState = {
            profileId: origin.profileId,
            email: auth.email!,
            imageUrl: auth.imageUrl!,
            type: 'camera',
            micOn: false,
            cameraOn: false,
          };
          socket.emit('client:meeting:join', origin, meetingState);
          console.log(peer.current!.connections);
        });

        stream.getTracks().forEach(track => (track.enabled = !track.enabled));
        localStream.current = stream;

        console.log(stream);
        console.log(localStream);

        addVideo({
          stream: localStream.current!,
          profileId: auth.profileId!,
          imageUrl: auth.imageUrl!,
          email: auth.email!,
          micOn: micOn,
          cameraOn: cameraOn,
          type: 'camera',
        });

        socket.on('server:meeting:join:success', meetingStates => {
          // setMeetingStates(meetingStates);
          localMeetingStates.current = meetingStates;
          setUseStateLocalMeetingStates(meetingStates);
          //Call những thằng nằm trong meetingStates mới nhận được.
          console.log('Da nhan meeting state, bat dau goi: ');
          console.log(meetingStates);

          Object.values(meetingStates).forEach(meetingState => {
            if (meetingState.profileId !== origin.profileId) {
              let otherId = meetingState.profileId;
              try {
                let call = peer.current!.call(otherId, localStream.current!);
                console.log('Calling: ' + otherId + ' with ');
                console.log(localStream);
                call.once('stream', otherStream => {
                  addPeerOnConnect(otherId, call);
                  console.log('Receive answer from: ' + otherId);
                  // let otherIndexState = 0;
                  // for (let i = 0; i < localMeetingStates.current.length; i++) {
                  //   if (localMeetingStates.current[i].profileId === otherId) {
                  //     otherIndexState = i;
                  //     break;
                  //   }
                  // }
                  // console.log(localMeetingStates);
                  // let otherState = localMeetingStates.current[otherIndexState];
                  let otherState = meetingState;

                  if (otherState.type === 'camera') {
                    let newVideoProps: VideoProps = {
                      stream: otherStream,
                      profileId: otherState.profileId,
                      imageUrl: otherState.imageUrl,
                      email: otherState.email,
                      micOn: otherState.micOn,
                      cameraOn: otherState.cameraOn,
                      type: 'camera',
                    };
                    addVideo(newVideoProps);
                  } else if (otherState.type === 'screen') {
                    //Khi peer bên kia là screen
                    let newVideoProps: VideoProps = {
                      stream: otherStream,
                      profileId: otherState.profileId,
                      imageUrl: otherState.imageUrl,
                      email: otherState.email,
                      type: 'screen',
                    };
                    addVideo(newVideoProps);
                  }
                });
                call.on('close', () => {
                  console.log('second user removing: ' + otherId);
                  removeVideo(otherId);
                  removePeerOnConnect(otherId);
                });
              } catch (err) {
                console.log(err);
              }
            }
          });
        });

        peer.current.on('call', call => {
          let callerId = call.peer;
          call.answer(stream);
          call.once('stream', (callerStream: MediaStream) => {
            console.log('Receive stream from caller:' + callerId);
            console.log(localMeetingStates.current);
            let callerStateIndex = 0;
            // for (let i = 0; i < localMeetingStates.current.length; i++) {
            //   if (localMeetingStates.current[i].profileId === callerId) {
            //     callerStateIndex = i;
            //     break;
            //   }
            // }
            let callerStateId = '';
            Object.keys(localMeetingStates.current).forEach(key => {
              if (localMeetingStates.current[key].profileId === callerId)
                callerStateId = localMeetingStates.current[key].profileId;
            });
            console.log(localMeetingStates);
            let callerState = localMeetingStates.current[callerStateId];

            addPeerOnConnect(callerId, call);
            if (callerState.type === 'camera') {
              let newVideoProps: VideoProps = {
                stream: callerStream,
                profileId: callerState.profileId,
                imageUrl: callerState.imageUrl,
                email: callerState.email,
                micOn: callerState.micOn,
                cameraOn: callerState.cameraOn,
                type: 'camera',
              };
              addVideo(newVideoProps);
            } else if (callerState.type === 'screen') {
              let newVideoProps: VideoProps = {
                stream: callerStream,
                profileId: callerState.profileId,
                imageUrl: callerState.imageUrl,
                email: callerState.email,
                type: 'screen',
              };
              addVideo(newVideoProps);
              // } else if (callerState.type === 'screen') {
              //   let newVideoProps: VideoProps = {
              //     stream: callerStream,
              //     profileId: callerState.profileId,
              //     imageUrl: callerState.imageUrl,
              //     email: callerState.email,
              //     type: 'screen',
              //   };
              //   addVideo(newVideoProps);
            }
          });
          call.on('close', () => {
            console.log('the first user remove: ' + callerId);
            removePeerOnConnect(callerId);
            removeVideo(callerId);
            console.log(peerOnConnect);
          });
        });

        socket.on('server:meeting:disconnect', id => {
          let leaverEmail = localMeetingStates.current[id].email;
          let leaverScreenState = Object.values(localMeetingStates.current).filter(meetingState => {
            return meetingState.type === 'screen' && meetingState.email === leaverEmail;
          })[0];
          if (leaverScreenState) {
            let leaverScreenId = leaverScreenState.profileId;
            peerOnConnect.current.get(leaverScreenId)?.close();
            removePeerOnConnect(leaverScreenId);
          }
          peerOnConnect.current.get(id)?.close();
          removePeerOnConnect(id);
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
        // let meetingState = meetingStates[stateIndex];
        // if (meetingState.type === 'camera') {
        //   let newVideoProps: VideoProps = {
        //     stream: videoList[i].stream,
        //     profileId: profileId,
        //     email: meetingState.email,
        //     imageUrl: meetingState.imageUrl,
        //     cameraOn: meetingState.cameraOn,
        //     micOn: meetingState.micOn
        //   }
        //   newVideoList.push(newVideoProps);
        // }

        // if (newVideoList.length !== videoList.length) console.log('Sync video list problem');

        // setVideoList(newVideoList);
      }
    }

    socket.on('server:meeting:state', meetingStates => {
      // setMeetingStates(meetingStates);
      console.log('update');
      console.log(meetingStates);
      console.log(peerOnConnect);
      console.log(videoGrid);

      // if (localMeetingStates.current.length > meetingStates.length) {
      //   let leaverState = localMeetingStates.current.filter(state => {
      //     let exist = false;
      //     for (let i = 0; i < meetingStates.length; i++) {
      //       if (meetingStates[i].profileId === state.profileId) {
      //         exist = true;
      //         break;
      //       }
      //     }
      //     return !exist;
      //   })[0];
      //   if (leaverState.type === 'screen') {
      //   }
      // } else if (localMeetingStates.current.length === meetingStates.length) {
      //   // Mic, or Camera toogle
      //   let tooglerIndex = -1;
      //   for (let i = 0; i < localMeetingStates.current.length; i++) {
      //     let oldState = localMeetingStates.current[i];
      //     if (oldState.type === 'camera') {
      //       for (let j = 0; j < meetingStates.length; j++) {
      //         let newState = meetingStates[j];
      //         if (newState.type === 'camera') {
      //           if (
      //             oldState.profileId === newState.profileId &&
      //             (oldState.cameraOn !== newState.cameraOn || oldState.micOn !== newState.micOn)
      //           ) {
      //             tooglerIndex = j;
      //             break;
      //           }
      //         }
      //       }
      //     }
      //   }
      //   let tooglerState = meetingStates[tooglerIndex];
      //   let tooglerId = tooglerState.profileId;
      //   if (tooglerState.type === 'camera') {
      //     let row = -1;
      //     let col = -1;
      //     for (let i = 0; i < videoGrid.length; i++) {
      //       for (let j = 0; j < MAX_VIDEO_PER_ROW; j++) {
      //         if (videoGrid[i][j].profileId === tooglerState.profileId) {
      //           row = i;
      //           col = j;
      //         }
      //       }
      //     }
      //     let oldStream = videoGrid[row][col].stream;

      //     let newVideoProp: VideoProps = {
      //       stream: oldStream,
      //       profileId: tooglerState.profileId,
      //       email: tooglerState.email,
      //       imageUrl: tooglerState.imageUrl,
      //       micOn: tooglerState.micOn,
      //       cameraOn: tooglerState.cameraOn,
      //       type: 'camera',
      //     };
      //     updateVideoGrid(newVideoProp, row, col);
      //   }
      // }

      localMeetingStates.current = meetingStates;
      setUseStateLocalMeetingStates(meetingStates);

      // let newVideoList = videoList.filter((video) => {
      //   peerOnConnect.has(video.profileId) || video.profileId === origin.profileId;
      // });
      // let newVideoList = videoList.filter((video) => {
      //   for (let i = 0; i < meetingStates.length; i++) {
      //     if (meetingStates[i].profileId === video.profileId) {
      //       return true;
      //     }
      //   }
      //   return false;
      // });
      // let myState = meetingStates.filter(state => state.profileId === auth.profileId)[0];
      // // const myVideoProp: VideoProps ={
      // //   email: auth.email!,
      // //   cameraOn: cameraOn,
      // //   micOn: micOn,
      // //   imageUrl: auth.imageUrl!,
      // //   stream: myState.
      // // }
      // newVideoList.push(videoList.filter(video => video.profileId === auth.profileId!)[0]);
      // console.log('New video length:' + newVideoList.length);
      // syncVideoListState(newVideoList, meetingStates);
    });

    // socket.on('server:room:leave:success', function (msg) {
    //   let leaveId = msg.split(' ')[1];
    //   console.log(leaveId + ' just leave the room to get to the text');
    // });

    return function () {
      let identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
      // check mình đang có peer nào
      // Có cái nào thì ném hết lên (tôi đa emit 2 lần)
      socket.emit('client:meeting:leave', origin, identity);
      if (localScreenStream.current) {
        socket.emit('client:meeting:leave', origin, {
          profileId: screenId.current!,
          type: 'screen',
        });
      }
      console.log('clean up group');
      // peerOnConnect.current.forEach((call) => {
      //   call.close();
      // });
      localStream.current?.getTracks().forEach(track => track.stop());
      localStream.current = undefined;
      peer.current?.destroy();
      peer.current = undefined;
      localScreenStream.current?.getTracks().forEach(track => track.stop());
      localStream.current = undefined;
      screenPeer.current?.destroy();
      screenPeer.current = undefined;

      socket.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    console.log('list updated: ');
    console.log(videoGrid);
  }, [videoGrid]);

  useEffect(() => {
    console.log('Video props set');

    let newGrid: VideoProps[][] = [];
    console.log('Grid: ');
    console.log(videoGrid);
    console.log('Peer on connect: ');
    console.log(peerOnConnect.current);
    console.log('Local meetin State');
    console.log(localMeetingStates.current);
    if (videoGrid.length !== 0) {
      let numOfCurrentVideo =
        (videoGrid.length - 1) * MAX_VIDEO_PER_ROW + videoGrid[videoGrid.length - 1].length;
      let i = 0;
      while (i < numOfCurrentVideo) {
        let row = Math.floor(i / MAX_VIDEO_PER_ROW);
        let col = i % MAX_VIDEO_PER_ROW;
        let oldVideo = videoGrid[row][col];

        if (
          oldVideo.profileId === origin.profileId ||
          oldVideo.profileId === screenId.current ||
          (localMeetingStates.current[oldVideo.profileId] &&
            peerOnConnect.current.has(oldVideo.profileId))
        ) {
          let newState = localMeetingStates.current[oldVideo.profileId];
          if (newState.type === 'camera' && oldVideo.type === 'camera') {
            console.log(newState);

            let newVideo: VideoProps = {
              ...oldVideo,
              cameraOn: newState.cameraOn,
              micOn: newState.micOn,
            };

            console.log(newVideo);

            if (newGrid.length === 0 || newGrid[newGrid.length - 1].length === MAX_VIDEO_PER_ROW) {
              newGrid.push([newVideo]);
            } else {
              newGrid[newGrid.length - 1].push(newVideo);
            }
          } else if (newState.type === 'screen' && oldVideo.type === 'screen') {
            let newVideo: VideoProps = {
              ...oldVideo,
            };

            if (newGrid.length === 0 || newGrid[newGrid.length - 1].length === MAX_VIDEO_PER_ROW) {
              newGrid.push([newVideo]);
            } else {
              newGrid[newGrid.length - 1].push(newVideo);
            }
          }
        }
        i++;
      }
      setVideoGrid(newGrid);
    } else {
      console.log('Video grid does not have any thing!');
    }
  }, [useStateLocalMeetingStates, peerOnConnect.current]);

  function addVideo(newVideoProps: VideoProps) {
    // const lastRow = videoGrid.length;
    // if (videoGrid.length === 0 || videoGrid[videoGrid.length - 1].length % MAX_VIDEO_PER_ROW === 0) {
    //   setVideoGrid(prevVideoGrid => [...prevVideoGrid, [newVideoProps]]);
    // } else {
    //   setVideoGrid(prevVideoGrid => {
    //     const newGrid = [...prevVideoGrid];
    //     // newGrid[newGrid.length - 1] = [...newGrid[newGrid.length - 1], newVideoProps];
    //     newGrid[newGrid.length - 1].push(newVideoProps);
    //     return newGrid;
    //   })
    // }

    // let newGrid = [...videoGrid];
    // if (newGrid.length === 0 || newGrid[newGrid.length - 1].length === MAX_VIDEO_PER_ROW) {
    //   newGrid.push([newVideoProps]);
    // } else {
    //   newGrid[newGrid.length - 1].push(newVideoProps);
    // }
    // setVideoGrid(newGrid);

    setVideoGrid(prevVideoGrid => {
      const newGrid = [...prevVideoGrid];

      // Check if the last row is empty or full
      const lastRow = newGrid.length - 1;
      if (newGrid.length === 0 || newGrid[lastRow].length === MAX_VIDEO_PER_ROW) {
        // If empty or full, add a new row
        newGrid.push([newVideoProps]);
      } else {
        // Otherwise, add the video to the last row
        newGrid[lastRow].push(newVideoProps);
      }

      return newGrid;
    });
  }

  function updateVideoGrid(newVideoState: VideoProps, tooglerRow: number, tooglerCol: number) {
    const newGrid = videoGrid.map((videoStates, row) => {
      return videoStates.map((videoState, col) => {
        if (row == tooglerCol && col == tooglerCol) {
          return newVideoState;
        }
        return videoState;
      });
    });

    setVideoGrid(newGrid);
  }

  function removeVideo(id: string) {
    // // Create a new grid without the video with the specified profileId
    // console.log(videoGrid);
    // let newGrid: VideoProps[][] = [];

    // let i = 0;
    // let j = 0;

    // let numOfVid = (videoGrid.length - 1) * MAX_VIDEO_PER_ROW + videoGrid[videoGrid.length - 1].length;

    // while (i < numOfVid) {
    //   let row = Math.floor(numOfVid / MAX_VIDEO_PER_ROW);
    //   let col = numOfVid % MAX_VIDEO_PER_ROW;

    //   let currentVideoProps = videoGrid[row][col];

    //   if (currentVideoProps.profileId !== id) {
    //     if (newGrid.length === 0 || newGrid[newGrid.length - 1].length === MAX_VIDEO_PER_ROW) {
    //       newGrid.push([currentVideoProps]);
    //     } else {
    //       newGrid[newGrid.length - 1].push(currentVideoProps);
    //     }
    //     j++;
    //   }
    //   i++;
    // }
    // // const newGrid = videoGrid.map(row =>
    // //   row.filter(video => video.profileId !== id)
    // // );
    // setVideoGrid(newGrid);

    setVideoGrid(prevGrid => {
      // Find the position of the value in the 2D array
      let numberOfItem =
        (prevGrid.length - 1) * MAX_VIDEO_PER_ROW + prevGrid[prevGrid.length - 1].length;
      let rowIndex = -1;
      let columnIndex = -1;

      for (let i = 0; i < prevGrid.length; i++) {
        // const indexInRow = prevGrid[i].findIndex((video) => video.profileId === id);
        // if (indexInRow !== -1) {
        //   rowIndex = i;
        //   columnIndex = indexInRow;
        //   break;
        // }
        for (let j = 0; j < prevGrid[i].length; j++) {
          if (prevGrid[i][j].profileId === id) {
            rowIndex = i;
            columnIndex = j;
          }
        }
      }

      // If the value is not found, return the original array
      if (rowIndex === -1 || columnIndex === -1) {
        return prevGrid;
      }

      // Create a new array to avoid mutating the previous state
      const newGrid = prevGrid.map(row => [...row]);

      // Remove the item at the specified row and column
      // newGrid[rowIndex].splice(columnIndex, 1);

      // Shift the remaining elements to the left and up
      // for (let i = rowIndex; i < newGrid.length; i++) {
      //   for (let j = columnIndex; j < newGrid[i].length - 1; j++) {
      //     // Shift elements to the left
      //     newGrid[i][j] = newGrid[i][j + 1];
      //   }

      //   // If it's not the last row, shift the element up
      //   if (i < newGrid.length - 1) {
      //     newGrid[i][newGrid[i].length - 1] = newGrid[i + 1][0];
      //   }
      // }
      for (let i = rowIndex * MAX_VIDEO_PER_ROW + columnIndex; i < numberOfItem - 1; i++) {
        let oldRow = Math.floor(i / MAX_VIDEO_PER_ROW);
        let newRow = Math.floor((i + 1) / MAX_VIDEO_PER_ROW);
        let oldCol = i % MAX_VIDEO_PER_ROW;
        let newCol = (i + 1) % MAX_VIDEO_PER_ROW;

        newGrid[oldRow][oldCol] = newGrid[newRow][newCol];
      }
      // Remove the last element in the last row
      newGrid[newGrid.length - 1].pop();
      if (newGrid[newGrid.length - 1].length === 0) newGrid.pop();
      return newGrid;
    });
  }

  function addPeerOnConnect(id: string, call: MediaConnection) {
    // let newPeerOnConnect = new Map(peerOnConnect);
    // newPeerOnConnect.set(id, call);
    // setPeerOnConnect(newPeerOnConnect);
    peerOnConnect.current.set(id, call);
  }

  function removePeerOnConnect(id: string) {
    // let newPeerOnConnect = new Map(peerOnConnect);
    // newPeerOnConnect.delete(id);
    // setPeerOnConnect(newPeerOnConnect);
    peerOnConnect.current.delete(id);
  }

  const clickCamera = () => {
    setCameraOn(prev => !prev);
    let identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
    socket.emit('client:meeting:camera', origin, identity);
    localStream.current?.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const clickMic = () => {
    setMicOn(prev => !prev);
    let identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
    socket.emit('client:meeting:mic', origin, identity);
    localStream.current?.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const clickShareScreen = () => {
    console.log(shareScreenOn);

    if (!shareScreenOn) {
      navigator.mediaDevices.getDisplayMedia({ audio: true, video: true }).then(screenStream => {
        setShareScreenOn(true);
        screenStream.getVideoTracks()[0].onended = () => {
          setShareScreenOn(false);
          let screenState: MeetingState = {
            profileId: screenId.current!,
            email: auth.email!,
            imageUrl: auth.imageUrl!,
            type: 'screen',
          };
          screenPeer.current?.destroy();
          socket.emit('client:meeting:screen:off', origin, screenState);
          removeVideo(screenId.current!);
          // localScreenStream
        };
        localScreenStream.current = screenStream;
        screenPeer.current = new Peer(uuidv4());
        screenId.current = screenPeer.current.id;
        //
        screenPeer.current.on('call', call => {
          console.log('Screen received call from user: ' + call.peer);
          call.answer(localStream.current!);
        });
        //
        screenPeer.current.on('open', screenId => {
          let screenState: MeetingState = {
            profileId: screenId,
            email: auth.email!,
            imageUrl: auth.imageUrl!,
            type: 'screen',
          };

          let screenProps: VideoProps = {
            stream: screenStream,
            type: 'screen',
            email: auth.email!,
            imageUrl: auth.imageUrl!,
            profileId: screenId,
          };
          addVideo(screenProps);

          socket.on('server:meeting:screen:on:success', meetingStates => {
            Object.values(meetingStates).forEach(meetingState => {
              if (meetingState.profileId !== origin.profileId && meetingState.type === 'camera') {
                let otherId = meetingState.profileId;
                try {
                  //Gửi stream screen cho các người dùng
                  let call = screenPeer.current!.call(otherId, localScreenStream.current!);
                  console.log('Calling: ' + otherId + ' with ');
                  console.log(localStream);
                } catch (err) {
                  console.log(err);
                }
              }
            });
          });

          socket.emit('client:meeting:screen:on', origin, screenState);
        });
      });
    } else {
      // dung share man
      setShareScreenOn(false);
      localScreenStream.current?.getTracks().forEach(track => track.stop());
      let screenState: MeetingState = {
        profileId: screenId.current!,
        email: auth.email!,
        imageUrl: auth.imageUrl!,
        type: 'screen',
      };
      screenPeer.current?.destroy();
      socket.emit('client:meeting:screen:off', origin, screenState);

      removeVideo(screenId.current!);
    }
    // setShareScreenOn(prev => !prev);
  };

  const onEndCall = () => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full group relative px-4 py-2'>
      <div
        className={cn('flex-1 flex flex-col gap-y-4 overflow-y-auto', {
          'justify-center': videoGrid.length <= 2,
        })}
      >
        {videoGrid.map((row, i) => {
          return (
            <div
              className={cn('flex flex-col gap-y-1 md:flex-row md:gap-x-4 items-center', {
                'h-[500px]': videoGrid.length === 1,
                'h-[400px]': videoGrid.length === 2,
                'h-[300px]': videoGrid.length > 2,
              })}
              key={i}
            >
              {row.map(col => (
                <Video key={col.profileId} {...col} />
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

import { useEffect, useRef, useState } from 'react';
import Video from '@/components/VideoCard';
import Peer, { MediaConnection } from 'peerjs';
import { useNavigate, useParams } from 'react-router-dom';
import { GroupOrigin, socket } from '@/lib/socket';
import { useAuth } from '@/hooks/useAuth';
import { VideoProps } from '@/components/VideoCard';
import MicButton from '@/components/MicButton';
import ShareScreenButton from '@/components/ShareScreenButton';
import VideoButton from '@/components/CameraButton';
import PhoneButton from '@/components/PhoneButton';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { LoadingPage } from '@/components/Loading';
import { useToast } from '@/components/ui/use-toast';

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

const VideoPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { toast } = useToast();
  const { groupId, roomId } = useParams<{ groupId: string; roomId: string }>();
  const origin: GroupOrigin = {
    groupId: groupId!,
    roomId: roomId!,
    profileId: auth.profileId!,
  };

  const localMeetingStates = useRef<Record<string, MeetingState>>({});
  const peerOnConnect = useRef<Record<string, MediaConnection>>({});
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(function (stream) {
        peer.current = new Peer(origin.profileId);
        peer.current.on('open', () => {
          const meetingState: MeetingState = {
            profileId: origin.profileId,
            email: auth.email!,
            imageUrl: auth.imageUrl!,
            type: 'camera',
            micOn: false,
            cameraOn: false,
          };
          socket.emit('client:meeting:join', origin, meetingState);
        });

        stream.getTracks().forEach(track => (track.enabled = !track.enabled));
        localStream.current = stream;

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
          localMeetingStates.current = meetingStates;
          setUseStateLocalMeetingStates(meetingStates);
          //Call những peer nằm trong meetingStates mới nhận được.

          if (Object.keys(localMeetingStates.current).length === 1) {
            return setIsLoading(false);
          }

          Object.values(meetingStates).forEach(meetingState => {
            if (meetingState.profileId !== origin.profileId) {
              const otherId = meetingState.profileId;
              try {
                const call = peer.current!.call(otherId, localStream.current!);

                call.once('stream', otherStream => {
                  addPeerOnConnect(otherId, call);
                  const otherState = meetingState;

                  if (otherState.type === 'camera') {
                    const newVideoProps: VideoProps = {
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
                    const newVideoProps: VideoProps = {
                      stream: otherStream,
                      profileId: otherState.profileId,
                      imageUrl: otherState.imageUrl,
                      email: otherState.email,
                      type: 'screen',
                    };
                    addVideo(newVideoProps);
                  }
                  setIsLoading(false);
                });
                call.on('close', () => {
                  removeVideo(otherId);
                  removePeerOnConnect(otherId);
                });
              } catch (err) {
                console.error(err);
              }
            }
          });
        });

        peer.current.on('call', call => {
          const callerId = call.peer;
          call.answer(stream);
          call.once('stream', (callerStream: MediaStream) => {
            let callerStateId = '';
            Object.keys(localMeetingStates.current).forEach(key => {
              if (localMeetingStates.current[key].profileId === callerId)
                callerStateId = localMeetingStates.current[key].profileId;
            });
            const callerState = localMeetingStates.current[callerStateId];

            addPeerOnConnect(callerId, call);
            if (callerState.type === 'camera') {
              const newVideoProps: VideoProps = {
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
              const newVideoProps: VideoProps = {
                stream: callerStream,
                profileId: callerState.profileId,
                imageUrl: callerState.imageUrl,
                email: callerState.email,
                type: 'screen',
              };
              addVideo(newVideoProps);
            }
          });
          call.on('close', () => {
            removePeerOnConnect(callerId);
            removeVideo(callerId);
          });
        });

        socket.on('server:meeting:disconnect', id => {
          const leaverEmail = localMeetingStates.current[id].email;
          const leaverScreenState = Object.values(localMeetingStates.current).filter(
            meetingState => {
              return meetingState.type === 'screen' && meetingState.email === leaverEmail;
            },
          )[0];
          if (leaverScreenState) {
            const leaverScreenId = leaverScreenState.profileId;
            peerOnConnect.current[leaverScreenId]?.close();
            removePeerOnConnect(leaverScreenId);
          }
          peerOnConnect.current[id]?.close();
          removePeerOnConnect(id);
        });
      })
      .catch(function (err) {
        setIsLoading(false);
        setIsDenied(true);
        console.error(err);
        toast({
          title: 'Warning',
          description: 'Please allow access to camera and microphone',
          variant: 'warning',
        });
      });

    socket.on('server:meeting:state', meetingStates => {
      localMeetingStates.current = meetingStates;
      setUseStateLocalMeetingStates(meetingStates);
    });

    return function () {
      const identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
      // check mình đang có peer nào
      // Có cái nào thì ném hết lên (tôi đa emit 2 lần)
      socket.emit('client:meeting:leave', origin, identity);
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
    const newGrid: VideoProps[][] = [];
    setVideoGrid(prevVideoGrid => {
      if (prevVideoGrid.length !== 0) {
        const numOfCurrentVideo =
          (prevVideoGrid.length - 1) * MAX_VIDEO_PER_ROW +
          prevVideoGrid[prevVideoGrid.length - 1].length;
        let i = 0;
        while (i < numOfCurrentVideo) {
          const row = Math.floor(i / MAX_VIDEO_PER_ROW);
          const col = i % MAX_VIDEO_PER_ROW;
          const oldVideo = prevVideoGrid[row][col];
          if (
            oldVideo.profileId === origin.profileId ||
            oldVideo.profileId === screenId.current ||
            (localMeetingStates.current[oldVideo.profileId] &&
              peerOnConnect.current[oldVideo.profileId])
          ) {
            const newState = localMeetingStates.current[oldVideo.profileId];
            if (newState.type === 'camera' && oldVideo.type === 'camera') {
              const newVideo: VideoProps = {
                ...oldVideo,
                cameraOn: newState.cameraOn,
                micOn: newState.micOn,
              };
              if (
                newGrid.length === 0 ||
                newGrid[newGrid.length - 1].length === MAX_VIDEO_PER_ROW
              ) {
                newGrid.push([newVideo]);
              } else {
                newGrid[newGrid.length - 1].push(newVideo);
              }
            } else if (newState.type === 'screen' && oldVideo.type === 'screen') {
              const newVideo: VideoProps = {
                ...oldVideo,
              };

              if (
                newGrid.length === 0 ||
                newGrid[newGrid.length - 1].length === MAX_VIDEO_PER_ROW
              ) {
                newGrid.push([newVideo]);
              } else {
                newGrid[newGrid.length - 1].push(newVideo);
              }
            }
          }
          i++;
        }
        return newGrid;
      } else {
        return [];
      }
    });
    // Có thể localMeetingStates và PeerOnConnect chưa kịp đồng bộ trạng thái, nên ta sử dụng localMeetingState
    if (videoOnFocus && !localMeetingStates.current[videoOnFocus.profileId]) {
      setVideoOnFocus(undefined);
    } else if (videoOnFocus) {
      setVideoOnFocus(prevVideoOnFocus => {
        if (prevVideoOnFocus) {
          const newState: MeetingState = localMeetingStates.current[prevVideoOnFocus.profileId];
          if (newState.type === 'screen' && prevVideoOnFocus?.type == 'screen') {
            const newVideo: VideoProps = {
              ...prevVideoOnFocus,
            };
            return newVideo;
          } else if (newState.type === 'camera' && prevVideoOnFocus?.type === 'camera') {
            const newVideo: VideoProps = {
              ...prevVideoOnFocus,
              cameraOn: newState.cameraOn,
              micOn: newState.micOn,
            };
            return newVideo;
          }
        }
      });
    }
  }, [useStateLocalMeetingStates, peerOnConnect.current]);

  function addVideo(newVideoProps: VideoProps) {
    setVideoGrid(prevVideoGrid => {
      const newGrid = [...prevVideoGrid];
      const lastRow = newGrid.length - 1;
      if (newGrid.length === 0 || newGrid[lastRow].length === MAX_VIDEO_PER_ROW) {
        newGrid.push([newVideoProps]);
      } else {
        newGrid[lastRow].push(newVideoProps);
      }

      return newGrid;
    });
  }

  function removeVideo(id: string) {
    setVideoGrid(prevGrid => {
      const numberOfItem =
        (prevGrid.length - 1) * MAX_VIDEO_PER_ROW + prevGrid[prevGrid.length - 1].length;
      let rowIndex = -1;
      let columnIndex = -1;

      for (let i = 0; i < prevGrid.length; i++) {
        for (let j = 0; j < prevGrid[i].length; j++) {
          if (prevGrid[i][j].profileId === id) {
            rowIndex = i;
            columnIndex = j;
          }
        }
      }
      if (rowIndex === -1 || columnIndex === -1) {
        return prevGrid;
      }
      const newGrid = prevGrid.map(row => [...row]);
      for (let i = rowIndex * MAX_VIDEO_PER_ROW + columnIndex; i < numberOfItem - 1; i++) {
        const oldRow = Math.floor(i / MAX_VIDEO_PER_ROW);
        const newRow = Math.floor((i + 1) / MAX_VIDEO_PER_ROW);
        const oldCol = i % MAX_VIDEO_PER_ROW;
        const newCol = (i + 1) % MAX_VIDEO_PER_ROW;

        newGrid[oldRow][oldCol] = newGrid[newRow][newCol];
      }
      newGrid[newGrid.length - 1].pop();
      if (newGrid[newGrid.length - 1].length === 0) newGrid.pop();
      return newGrid;
    });
  }

  function addPeerOnConnect(id: string, call: MediaConnection) {
    peerOnConnect.current[id] = call;
  }

  function removePeerOnConnect(id: string) {
    delete peerOnConnect.current[id];
  }

  const clickCamera = () => {
    setCameraOn(prev => !prev);
    const identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
    socket.emit('client:meeting:camera', origin, identity);
    localStream.current?.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const clickMic = () => {
    setMicOn(prev => !prev);
    const identity: MeetingStateIdentity = { profileId: origin.profileId, type: 'camera' };
    socket.emit('client:meeting:mic', origin, identity);
    localStream.current?.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
  };

  const clickShareScreen = () => {
    if (!shareScreenOn) {
      navigator.mediaDevices
        .getDisplayMedia({ audio: true, video: true })
        .then(screenStream => {
          setShareScreenOn(true);
          screenStream.getVideoTracks()[0].onended = () => {
            setShareScreenOn(false);
            const screenState: MeetingState = {
              profileId: screenId.current!,
              email: auth.email!,
              imageUrl: auth.imageUrl!,
              type: 'screen',
            };
            screenPeer.current?.destroy();
            socket.emit('client:meeting:screen:off', origin, screenState);
            removeVideo(screenId.current!);
          };
          localScreenStream.current = screenStream;
          screenPeer.current = new Peer(uuidv4());
          screenId.current = screenPeer.current.id;
          //
          screenPeer.current.on('call', call => {
            call.answer(screenStream);
          });
          //
          screenPeer.current.on('open', screenId => {
            const screenState: MeetingState = {
              profileId: screenId,
              email: auth.email!,
              imageUrl: auth.imageUrl!,
              type: 'screen',
            };

            const screenProps: VideoProps = {
              stream: screenStream,
              type: 'screen',
              email: auth.email!,
              imageUrl: auth.imageUrl!,
              profileId: screenId,
            };
            addVideo(screenProps);

            socket.once('server:meeting:screen:on:success', meetingStates => {
              Object.values(meetingStates).forEach(meetingState => {
                if (meetingState.profileId !== origin.profileId && meetingState.type === 'camera') {
                  const otherId = meetingState.profileId;
                  try {
                    //Gửi stream screen cho các người dùng
                    screenPeer.current!.call(otherId, screenStream);
                  } catch (err) {
                    console.error(err);
                  }
                }
              });
            });

            socket.emit('client:meeting:screen:on', origin, screenState);
          });
        })
        .catch(function () {
          toast({
            title: 'Screen share canceled',
            description: 'You canceled the screen sharing',
            variant: 'info',
          });
        });
    } else {
      // dung share man
      setShareScreenOn(false);
      localScreenStream.current?.getTracks().forEach(track => track.stop());
      const screenState: MeetingState = {
        profileId: screenId.current!,
        email: auth.email!,
        imageUrl: auth.imageUrl!,
        type: 'screen',
      };
      screenPeer.current?.destroy();
      socket.emit('client:meeting:screen:off', origin, screenState);

      removeVideo(screenId.current!);
    }
  };

  const onEndCall = () => {
    navigate(`/rooms/${roomId}`);
  };

  const [videoOnFocus, setVideoOnFocus] = useState<VideoProps>();
  const onPinClick = (profileId: string) => {
    if (videoOnFocus) {
      addVideo(videoOnFocus);
      videoGrid.forEach(row => {
        row.forEach(col => {
          if (col.profileId === profileId) {
            setVideoOnFocus(col);
          }
        });
      });
      removeVideo(profileId);
    } else {
      videoGrid.forEach(row => {
        row.forEach(col => {
          if (col.profileId === profileId) {
            setVideoOnFocus(col);
          }
        });
      });
      removeVideo(profileId);
    }
  };

  const onUnpinClick = () => {
    if (videoOnFocus) {
      addVideo(videoOnFocus);
      setVideoOnFocus(undefined);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isDenied) {
    return (
      <div className='bg-white dark:bg-[#313338] flex items-center justify-center h-full px-4 py-2 text-4xl font-bold'>
        Require permission for camera and microphone
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full group relative px-4 py-2'>
      <div
        className={cn('flex-1 flex flex-col gap-y-4 overflow-y-auto', {
          'justify-center': videoGrid.length < 2 && !videoOnFocus,
        })}
      >
        {videoOnFocus && (
          <div className={cn('flex flex-col gap-y-1 md:flex-row md:gap-x-4 items-center')}>
            <Video {...videoOnFocus} onPinClick={onUnpinClick} pin={true} className='h-[700px]' />
          </div>
        )}
        {videoGrid.map((row, i) => {
          return (
            <div
              className={cn('flex flex-col gap-y-1 md:flex-row md:gap-x-4 items-center')}
              key={i}
            >
              {row.map(col => (
                <Video
                  key={col.profileId}
                  {...col}
                  onPinClick={onPinClick}
                  className={cn({
                    'h-[600px]': videoGrid.length === 1,
                    'h-[500px]': videoGrid.length === 1 && videoGrid[0].length > 2,
                    'h-[400px]': videoGrid.length === 2,
                    'h-[300px]': videoGrid.length > 2,
                  })}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div className='absolute inset-x-0 z-10 mx-auto bottom-10 opacity-0 flex translate-y-[100px] group-hover:translate-y-0 group-hover:opacity-1 group-hover:opacity-100 item-center justify-center gap-x-6 transition-all duration-500'>
        <VideoButton on={cameraOn} onClick={clickCamera} />
        <MicButton on={micOn} onClick={clickMic} />
        <ShareScreenButton on={shareScreenOn} onClick={clickShareScreen} />
        <PhoneButton on={false} onClick={onEndCall} />
      </div>
    </div>
  );
};

export default VideoPage;

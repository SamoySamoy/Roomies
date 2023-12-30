import { useEffect, useRef, useState } from "react";
const socket = io('/');
import Video from "@/components/ui/video";
import { Button } from "@/components/ui/button";
import Peer from 'peerjs';
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { vi } from "@faker-js/faker";
const AudioPage = () => {
    const [videoList, setVideoList] = useState<{peerId: string, mute: boolean, stream: MediaStream}[]>([]);
    const [peerId, setPeerId] = useState<string>('');
    const [camera, setCamera] = useState('on');
    const myVideo = useRef<HTMLVideoElement>(null);
    const { audioId } = useParams();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [canShareScreen, setCanShareScreen] = useState(true);
    useEffect(() => {
        const peer = new Peer();
        
        peer.on('open', (id) => {
            setPeerId(id);
            console.log(id);
            socket.emit('join-room', audioId, id);
            
        });
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(function (stream) {
            if (myVideo.current != null){
                myVideo.current.srcObject = stream;
                myVideo.current.muted = true;
                myVideo.current.play();
                
            } 
            setLocalStream(stream);
            addVideo("peerID", true, stream);
        })
        
    }, [])

    function addVideo(peerId: string, mute: boolean, stream: MediaStream) {
        const newVid = {peerId : peerId, mute: mute, stream: stream};
        setVideoList([...videoList, newVid]);
    }

    function removeVideo(id: string) {
        const newList = videoList.filter((item) => item.peerId !== id);
        setVideoList(newList);
    }

    function clickCamera() {
        if (camera === 'on') setCamera('off');
        else setCamera('on');
        socket.emit('camera-off', peerId);
        const videoTrack = localStream?.getTracks().find(track => track.kind === 'video');
        if (videoTrack) videoTrack.enabled = false;
    }
    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video:true,
        }).then(function (stream) {
            addVideo("screen", true, stream);
        })
        setCanShareScreen(false);
    }
    return (
        <div className="grid-cols-3 auto-rows-auto bg-slate-500 h-full">
            <Button className="bg-lime-600 mx-1" onClick={clickCamera}>Camera is {camera}</Button>
            <Button className="bg-lime-600" onClick={shareScreen} disabled={!canShareScreen}>Share Screen</Button>
            {/* <video ref={myVideo}></video> */}
            <div className="grid-cols-3">
                {/* {localStream && <Video mute={true} stream={localStream} peerId={peerId}/>} */}
                {videoList.map(function (video) {
                return <Video key={video.peerId} mute={video.mute} stream={video.stream} peerId={video.peerId}/>
                })}
            </div>
        </div>
    )
}

export default AudioPage;
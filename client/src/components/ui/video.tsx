import {useRef, useState, useEffect} from "react";
import { MicOff, Mic } from "lucide-react";
interface VideoProps {
    stream: MediaStream | null;
    peerId: string;
    mute: boolean;

}

const Video = ({stream, peerId, mute}: VideoProps) => {
    const vid: React.MutableRefObject<HTMLVideoElement | null> = useRef<HTMLVideoElement | null>(null);
    const [id, setId] = useState('');
    const [muteAudio, setMuteAudio] = useState(false);
    useEffect( () =>{
        if (vid.current != null) {
            vid.current.srcObject = stream;
            setId(peerId);
            setMuteAudio(mute);
        }
    }, [])

    let mic;
    if (mute) {
        mic = <MicOff className="absolute bottom-1 left-1" size={20}></MicOff>
    } else {
        mic = <Mic></Mic>
    }
    
    return (
        <div className="relative">
            {mic}
            <span className="absolute bottom-1 left-10 text-base">{peerId}</span>
            <video className="w-1/3 h-auto" ref={vid} autoPlay playsInline muted={mute}></video>
        </div>
    );
}

export default Video;
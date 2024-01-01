import {useRef, useState, useEffect} from "react";
import { MicOff, Mic } from "lucide-react";
import { vi } from "@faker-js/faker";
export interface VideoProps {
    stream: MediaStream;
    peerId: string;
    mute: boolean;
}

const Video = ({stream, peerId, mute}: VideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream])

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
            <video className="w-1/3 h-auto" ref={videoRef} autoPlay playsInline muted={mute}></video>
        </div>
    );
}

export default Video;
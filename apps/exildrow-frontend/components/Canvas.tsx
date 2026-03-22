"use client"
import { drawCanvus } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({
    roomId,
    socket
 } : {
        roomId : string;
        socket: WebSocket;
}) {
    const canvusRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
            if(canvusRef.current) {
                drawCanvus(canvusRef.current, roomId, socket);
            }
        }, [roomId, socket]);
    return (
        <div>
            <canvas ref={canvusRef} width={1900} height={960} ></canvas>
        </div>
    )
}
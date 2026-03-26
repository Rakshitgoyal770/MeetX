"use client";
import {WS_URL} from "@/config";
import {useEffect, useState} from "react";
import Canvas from "@/components/Canvas";

export function RoomCanvus({roomId} : {roomId : string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDMyZGZmMS1hYmQ2LTQwZWYtYWE1ZC1iOTg1Mzk5ZTZiMTYiLCJpYXQiOjE3NzQ1MzY5NjgsImV4cCI6MTc3NDU0MDU2OH0.43T08b-8dkmDsL5xO6Lqo6ENG2srGHEbmOqdcRRSJLU";
        if (!token) {
            return;
        }

        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
             }))
        }
        return () => {
            ws.close();
        }
    }, [roomId])


    if(!socket){
        return <div>
            connecting to Server...
        </div>
    }
    return (
        <>
        <div className="w-full h-screen">
            <Canvas roomId={roomId} socket={socket} />
            
        </div>
        </>
)} 
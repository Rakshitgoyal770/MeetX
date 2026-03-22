"use client";
import {WS_URL} from "@/config";
import {useEffect, useState} from "react";
import Canvas from "@/components/Canvas";

export function RoomCanvus({roomId} : {roomId : string}) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDMyZGZmMS1hYmQ2LTQwZWYtYWE1ZC1iOTg1Mzk5ZTZiMTYiLCJpYXQiOjE3NzQxOTEzMjcsImV4cCI6MTc3NDE5NDkyN30.ajnB75218HsG2NKoLw7bhrtCd66M8KHoVikCwHMm7I0";
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
            <div className="absolute bottom-4 right-4 flex gap-2 bg-white shadow-lg p-2 rounded-lg">
                <button className="px-3 py-1 bg-black text-white rounded">Rectangle</button>
                <button className="px-3 py-1 bg-black text-white rounded">Circle</button>
                <button className="px-3 py-1 bg-black text-white rounded">Line</button>
            </div>
        </div>
        </>
)} 
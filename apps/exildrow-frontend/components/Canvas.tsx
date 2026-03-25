"use client"
import { drawCanvus } from "@/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./icon";
import { Square, Circle, Minus } from "lucide-react";

export default function Canvas({
    roomId,
    socket
} : {
    roomId : string;
    socket: WebSocket;
}) {
    const [Icon, setIcon] = useState<"rectangle" | "circle" | "line">("circle");
    const canvusRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
            if(canvusRef.current) {
                drawCanvus(canvusRef.current, roomId, socket);
            }
        }, [roomId, socket]);
    return (
        <div style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}>
            <div >
                <canvas ref={canvusRef} width={1900} height={960} ></canvas>
            </div>
            <TopBar SelectedIcon={Icon} setIcon={setIcon} />
        </div>
    )
}

function TopBar({
    SelectedIcon , setIcon}:
    {
        SelectedIcon : "rectangle" | "circle" | "line",
        setIcon : React.Dispatch<React.SetStateAction<"rectangle" | "circle" | "line">>
    }
) { 
    return (
        <div className="fixed bottom-4 right-4 flex gap-2 bg-white p-2 rounded-md shadow-md">
            <IconButton activated={SelectedIcon === "rectangle"} icon={<Square />} onClick={() => {
                setIcon("rectangle");
            }} />
            <IconButton activated={SelectedIcon === "circle"} icon={<Circle />} onClick={() => {
                setIcon("circle");
            }} />
            <IconButton activated={SelectedIcon === "line"} icon={<Minus />} onClick={() => {
                setIcon("line"); 
            }} />
        </div>
    )
}
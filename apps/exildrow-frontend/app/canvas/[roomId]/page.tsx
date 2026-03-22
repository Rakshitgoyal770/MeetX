"use client";

import {useEffect, useRef} from "react";
import { drawCanvus } from "@/draw";

export default function Canvas() {
    const canvusRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvusRef.current) {
            const canvus = canvusRef.current;
            const ctx = canvus.getContext("2d");
            
            if(!ctx) {
                return
            }

            drawCanvus(canvus);


        }
    }, [canvusRef])
    return (
        <>
        <div className="w-full h-screen">
            <canvas ref={canvusRef} width={1900} height={960} ></canvas>
        </div>
        </>
    )
}
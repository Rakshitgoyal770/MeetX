"use c lient";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/dist/client/components/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();
    
  return (
    <div className={styles.container}>
      <input value={roomId} onChange={(e) => {
        setRoomId(e.target.value)
      }} type="text"  placeholder="RoomId"/>

      <button onClick = {() =>{ 
        router.push(`/room/${roomId}`);
      }}>Join Room</button>
    </div>
  );
}
 
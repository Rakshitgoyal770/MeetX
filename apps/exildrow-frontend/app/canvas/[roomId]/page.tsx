import {RoomCanvus} from "@/components/RoomCanvus";
export default async function CanvasPage({params} :{
    params : {
        roomId : string
    }
 }){
    const roomId = (await params).roomId;
    console.log(roomId);

    return <RoomCanvus roomId={roomId} />

}
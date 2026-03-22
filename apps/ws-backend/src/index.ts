import {WebSocketServer, WebSocket} from 'ws';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config';
import {prismaClient} from '@repo/db/client'
 
const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws : WebSocket,
    rooms : number[],
    userId : string
}

const users : User[] = [];

function checkUser(token: string): string | null{
    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        if(typeof decoded === "string"){
            wss.close();
            return null;
        }
        if(!decoded || !decoded.userId ){
            wss.close();
            return null;
        }
        return decoded.userId;
    }
    catch(err){
        return null;
    }
    
}

wss.on('connection', async (ws, request) => {
    const url = request.url;
    if(!url){
        return;
    }

    const queryParams =  new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || " ";
    const userId = checkUser(token);

    if(!userId){
        ws.close()
        return;
    }

    users.push({ 
        ws,
        rooms: [],
        userId: userId
    });

    ws.on('message', async function message(data) {
        let parseData;
        if(typeof data !== "string"){
            parseData = JSON.parse(data.toString());
        } else {
            parseData = JSON.parse(data);
        }
        if (parseData.type === "join_room") {
            console.log("JOIN REQUEST:", parseData);

            const user = users.find(u => u.ws === ws);

            console.log("FOUND USER:", user);

            if (!user) {
                console.log("❌ User not found in users array");
                return;
            }

            user.rooms.push(Number(parseData.roomId));
            console.log("✅ Joined room:", user.rooms);
        }

        if(parseData.type === "leave_room"){
            const user = users.find(u => u.ws === ws);
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(r => r !== Number(parseData.room));
        }

        

        if(parseData.type === "chat"){
            const roomId = Number(parseData.roomId);
            const message = parseData.message;


            await prismaClient.chat.create({
                data:{
                    roomId,
                    userId,
                    message
                }
            })
            
            users.forEach(u => {
                if(u.rooms.includes(roomId)){
                    u.ws.send(JSON.stringify({
                        type : "chat",
                        roomId,
                        message: message  
                    }));
                }
        });
    };
   });
}); 
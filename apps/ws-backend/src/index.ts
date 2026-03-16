import {WebSocketServer, WebSocket} from 'ws';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config';
 
const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws : WebSocket,
    rooms : string[],
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

wss.on('connection', (ws, request) => {
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

    ws.on('message', (message) => {
        const parseData = JSON.parse(message as unknown as string);

        if(parseData.type === "join_room"){
            const user = users.find(u => u.ws === ws);
            user?.rooms.push(parseData.roomId);
        }
        if(parseData.type === "leave_room"){
            const user = users.find(u => u.ws === ws);
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(r => r !== parseData.room);
        }

        if(parseData.type === "chat"){
            const roomId = parseData.roomId;
            const message = parseData.message;

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
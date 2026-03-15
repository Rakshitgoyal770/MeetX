import {WebSocketServer} from 'ws';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '@repo/backend-common/config';
 
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, request) => {
    const url = request.url;
    console.log('Client connected with URL:', url);

    if(!url) { 
        return;
    }

    const queryParams = new URLSearchParams(url.split('?')[1]) || new URLSearchParams(); // Remove leading '/'
    const token = queryParams.get('token') || ""; // Get the token from query parameters

    const decoded = jwt.verify(token, JWT_SECRET as string);

    if(!decoded) {
        ws.close();
        return;
    }

    ws.on('message', function message(data) {
        ws.send('pong');
    });
});
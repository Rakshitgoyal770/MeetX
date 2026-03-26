import axios from "axios";

type Shapes = {
    type :"retangle",
    x :number,
    y : number,
    width : number,
    height : number
} | {
    type :"circle",
    centerx : number,
    centery : number,
    radius : number
} | {
    type :"line",
    startx : number,
    starty : number,
    endx : number,
    endy : number
}

export async function drawCanvus(canvus : HTMLCanvasElement,  roomId : string, socket:WebSocket) {

    let existingShapes : Shapes[] = await getExistingShapes(roomId);

    const ctx = canvus.getContext("2d");
            
    if(!ctx) {
        return
    }

    socket.onmessage = (event) =>{
        const message = JSON.parse(event.data);

        if(message.type == "chat"){
            const parsedShape =JSON.parse(message.message)
            existingShapes.push(parsedShape)
            clearCanvus(existingShapes, canvus, ctx)
        }
    }

    clearCanvus(existingShapes, canvus, ctx);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvus.width, canvus.height);
        
    let clicked = false;
    let startX = 0;
    let startY = 0;
            
    canvus.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        console.log(startX, startY);
    })

    canvus.addEventListener("mouseup", (e) => {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        clicked = false;
        console.log(e.clientX, e.clientY);
        let shape: Shapes = {
            type: "retangle",
            x: startX,
            y: startY,
            width: width,
            height: height
        };
        // @ts-ignore
        const existingShape = window.Icon;
        if (existingShape === "rectangle") {
            shape = {
                type: "retangle",
                x: startX,
                y: startY,
                width: width,
                height: height
            };
        } else if (existingShape === "circle") {
            const centerX = startX + width/2;
            const centerY = startY + height/2;
            const radius = Math.sqrt((width*width + height*height))/2;
            shape = {
                type: "circle",
                centerx: centerX,
                centery: centerY,
                radius: radius
            };

        } else if (existingShape === "line") {
            shape = {
                type: "line",
                startx: startX,
                starty: startY,
                endx: e.clientX,
                endy: e.clientY
            }
        }
        existingShapes.push(shape);
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "chat",
                message : JSON.stringify(shape),
                roomId
            }))
        } else {
            console.error("WebSocket is not connected. ReadyState:", socket.readyState);
        }
    })

    canvus.addEventListener("mousemove", (e) => {
        if(clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvus(existingShapes, canvus, ctx);
            // @ts-ignore
            if(window.Icon === "rectangle") {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.strokeRect(startX, startY, width, height);
            }
            // @ts-ignore
            else if(window.Icon === "circle") {
                const centerX = startX + width/2;
                const centerY = startY + height/2;
                const radius = Math.sqrt((width*width + height*height))/2;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            }
            // @ts-ignore
            else if(window.Icon === "line") {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(e.clientX, e.clientY);
                ctx.stroke();
                ctx.closePath();
            }
        }
    });
}

function clearCanvus(shapes : Shapes[],canvas : HTMLCanvasElement, ctx : CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    shapes.map((shape) => {
        if(shape.type === "retangle") {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }

        else if(shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerx, shape.centery, shape.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }

        else if(shape.type === "line") {
            ctx.beginPath();
            ctx.moveTo(shape.startx, shape.starty);
            ctx.lineTo(shape.endx, shape.endy);
            ctx.stroke();
            ctx.closePath();
        }
    });
}

async function getExistingShapes(roomId: string) {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDMyZGZmMS1hYmQ2LTQwZWYtYWE1ZC1iOTg1Mzk5ZTZiMTYiLCJpYXQiOjE3NzQ1MzY5NjgsImV4cCI6MTc3NDU0MDU2OH0.43T08b-8dkmDsL5xO6Lqo6ENG2srGHEbmOqdcRRSJLU";
    if (!token) {
        return [];
    }

    try {
        const res = await axios.get(`http://localhost:8000/chats/${roomId}`, {
            headers: {
                authorization: token,
            },
        });

        const messages = res.data.messages;

        let inShapes = messages.map((x: { message: string }) => {
            return JSON.parse(x.message);
        });

        return inShapes;
    } catch (error) {
        console.error("Failed to fetch existing shapes", error);
        return [];
    }
}
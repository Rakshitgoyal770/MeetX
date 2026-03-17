import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware.js';
import {CreateUserSchema, SignInSchema , CreateRoomSchema} from '@repo/common/types';
import {prismaClient} from '@repo/db/client';
const app = express(); 
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/Signup", async (req, res) => {
    try {
        const parsedata = CreateUserSchema.safeParse(req.body);
        
        if (!parsedata.success) {
            console.error("Validation error:", parsedata.error);
            return res.status(400).json({
                msg: "Invalid data 3",
            });
        }

        const user = await prismaClient.user.create({
            data: {
                // Ensure these match your Zod schema and Prisma schema exactly
                email: parsedata.data.username, 
                password: parsedata.data.password,
                name: parsedata.data.name
            }
        });

        res.json({
            userId: user.id // Return the actual ID from the DB
        });

    } catch (err: any) {
        // Prisma throws a P2002 error code for unique constraint violations (already exists)
        if (err.code === 'P2002') {
            return res.status(409).json({
                msg: "User with this email already exists"
            });
        }

        res.status(500).json({
            msg: "Internal server error"
        });
    }
});

app.post("/Signin", async (req, res) => {
    const parsedata = SignInSchema.safeParse(req.body);
    if(!parsedata.success){
        console.error("Validation error:", parsedata.error);
        res.json({
            msg : "Invalid data"
        })
        return;
    }
    const User = await prismaClient.user.findFirst({
        where: {
            email: parsedata.data.username,
            password: parsedata.data.password
        }
    });

    if(!User){
        res.json({
            msg: "User not found Signin First"
        })
        return;
    }

    const token = jwt.sign({
        userId : User.id
     }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
        msg : "Login successful",
        Token : token
    })
});

app.post("/room", middleware, async (req, res) => {
    const parsedata = CreateRoomSchema.safeParse(req.body);
    if(!parsedata.success) {
        res.json({
            msg : "Invalid data"
        })
        return;
    }
    // @ts-ignore
    const userId = req.userId; // Assuming middleware sets req.userId
    
    try{
        const room = await prismaClient.room.create({
            data: {
                slug : parsedata.data.name,
                adminId : userId
            }
        })
        res.json({
            roomId : room.id,
            msg : "Room created successfully"
        })
    } catch(e) {
        res.json({
            message : "Room with this name already exists" 
        })
    }
 
});

app.get("/chats/:roomId", middleware, async (req, res) => {
    const roomId = Number(req.params.roomId);

    const messages = await prismaClient.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    });

    res.json({ messages });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})


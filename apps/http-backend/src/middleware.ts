import jwt from 'jsonwebtoken';
// 1. Only import it from the common repo
import { JWT_SECRET } from '@repo/backend-common/config'; 
import { Request, Response, NextFunction } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] || "";
    const token = authHeader.split(" ")[1] || authHeader;

    if (!token || typeof token !== 'string') {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Use 'as string' if the common package might still return string | undefined
        const decoded = jwt.verify(token, JWT_SECRET as string) as { userId: string };

        // 2. Attach the userId
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
}
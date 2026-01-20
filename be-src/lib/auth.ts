import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = process.env.SECRET_KEY || 'pet-finder-secret-key-2024';

export function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export function generateToken(userId: number): string {
    return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '7d' });
}

export function verifyToken(token: string): { id: number } | null {
    try {
        return jwt.verify(token, SECRET_KEY) as { id: number };
    } catch {
        return null;
    }
}

export interface AuthRequest extends Request {
    userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    try {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

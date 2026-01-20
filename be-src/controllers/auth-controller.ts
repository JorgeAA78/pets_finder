import { Request, Response } from 'express';
import { User } from '../db';
import { hashPassword, generateToken, AuthRequest } from '../lib/auth';

export async function register(req: Request, res: Response) {
    try {
        const { name, email, password, location, lat, lng } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = hashPassword(password);
        
        const user = await User.create({
            name: name || '',
            email,
            password: hashedPassword,
            location: location || '',
            lat: lat || null,
            lng: lng || null
        });

        const token = generateToken(user.id);

        res.json({ 
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                location: user.location
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const hashedPassword = hashPassword(password);
        
        const user = await User.findOne({ 
            where: { email, password: hashedPassword } 
        });

        if (!user) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        const token = generateToken(user.id);

        res.json({ 
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                location: user.location
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

export async function getMe(req: AuthRequest, res: Response) {
    try {
        const user = await User.findByPk(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            location: user.location,
            lat: user.lat,
            lng: user.lng
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({ error: 'Error al obtener datos del usuario' });
    }
}

export async function updateProfile(req: AuthRequest, res: Response) {
    try {
        const user = await User.findByPk(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { name, location, lat, lng } = req.body;
        
        await user.update({
            name: name || user.name,
            location: location || user.location,
            lat: lat !== undefined ? lat : user.lat,
            lng: lng !== undefined ? lng : user.lng
        });

        res.json({
            message: 'Perfil actualizado exitosamente',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                location: user.location,
                lat: user.lat,
                lng: user.lng
            }
        });
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
}

export async function updatePassword(req: AuthRequest, res: Response) {
    try {
        const user = await User.findByPk(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Contraseña actual y nueva son requeridas' });
        }

        const hashedCurrentPassword = hashPassword(currentPassword);
        
        if (user.password !== hashedCurrentPassword) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        await user.update({
            password: hashPassword(newPassword)
        });

        res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error actualizando contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar contraseña' });
    }
}

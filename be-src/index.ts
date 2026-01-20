import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { sequelize } from './db';
import { authMiddleware } from './lib/auth';

import { register, login, getMe, updateProfile, updatePassword } from './controllers/auth-controller';
import { createPet, getMyPets, getPetById, updatePet, deletePet, markAsFound, searchNearbyPets, getAllLostPets } from './controllers/pets-controller';
import { createReport, getReportsForPet } from './controllers/reports-controller';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.static('public'));

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authMiddleware, getMe);
app.put('/api/auth/profile', authMiddleware, updateProfile);
app.put('/api/auth/password', authMiddleware, updatePassword);

// ============================================
// RUTAS DE MASCOTAS
// ============================================
app.get('/api/pets', getAllLostPets);
app.get('/api/pets/nearby', searchNearbyPets);
app.get('/api/pets/my-pets', authMiddleware, getMyPets);
app.get('/api/pets/:id', getPetById);
app.post('/api/pets', authMiddleware, createPet);
app.put('/api/pets/:id', authMiddleware, updatePet);
app.delete('/api/pets/:id', authMiddleware, deletePet);
app.put('/api/pets/:id/found', authMiddleware, markAsFound);

// ============================================
// RUTAS DE REPORTES DE AVISTAMIENTOS
// ============================================
app.post('/api/reports', createReport);
app.get('/api/reports/pet/:petId', getReportsForPet);

// ============================================
// SPA FALLBACK
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ============================================
// INICIAR SERVIDOR
// ============================================
sequelize.sync().then(() => {
    console.log('✅ Base de datos sincronizada');
    app.listen(port, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('❌ Error al sincronizar base de datos:', error);
});

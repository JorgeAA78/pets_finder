import { Request, Response } from 'express';
import { Report, Pet, User } from '../db';
import { sendPetSightingEmail } from '../lib/resend';

export async function createReport(req: Request, res: Response) {
    try {
        const { petId, reporterName, reporterPhone, location, lat, lng, message } = req.body;

        if (!petId || !reporterName || !reporterPhone) {
            return res.status(400).json({ 
                error: 'ID de mascota, nombre y teléfono del reportante son requeridos' 
            });
        }

        const pet = await Pet.findByPk(petId, {
            include: [{ model: User, as: 'owner' }]
        });

        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        const report = await Report.create({
            petId,
            reporterName,
            reporterPhone,
            location: location || '',
            lat: lat || null,
            lng: lng || null,
            message: message || ''
        });

        const owner = (pet as any).owner;
        if (owner && owner.email) {
            await sendPetSightingEmail({
                to: owner.email,
                petName: pet.name,
                reporterName,
                reporterPhone,
                location: location || 'No especificada',
                message
            });
        }

        res.json({
            message: 'Reporte enviado exitosamente. El dueño será notificado.',
            report: {
                id: report.id,
                petId: report.petId,
                reporterName: report.reporterName,
                location: report.location
            }
        });
    } catch (error) {
        console.error('Error creando reporte:', error);
        res.status(500).json({ error: 'Error al enviar reporte' });
    }
}

export async function getReportsForPet(req: Request, res: Response) {
    try {
        const { petId } = req.params;

        const reports = await Report.findAll({
            where: { petId },
            order: [['createdAt', 'DESC']]
        });

        res.json(reports);
    } catch (error) {
        console.error('Error obteniendo reportes:', error);
        res.status(500).json({ error: 'Error al obtener reportes' });
    }
}

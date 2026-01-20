import { Request, Response } from 'express';
import { Pet, User, Report } from '../db';
import { AuthRequest } from '../lib/auth';
import { uploadImage } from '../lib/cloudinary';
import { indexPet, deletePetFromIndex, updatePetInIndex, searchPetsNearby } from '../lib/algolia';

export async function createPet(req: AuthRequest, res: Response) {
    try {
        const { name, characteristics, description, location, lat, lng, image } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'El nombre de la mascota es requerido' });
        }

        let imageUrl = null;
        if (image) {
            imageUrl = await uploadImage(image);
        }

        const pet = await Pet.create({
            name,
            characteristics: characteristics || '',
            description: description || '',
            status: 'lost',
            location: location || '',
            lat: lat || null,
            lng: lng || null,
            imageUrl,
            userId: req.userId
        });

        if (lat && lng) {
            await indexPet({
                id: pet.id,
                name: pet.name,
                location: pet.location,
                lat: pet.lat,
                lng: pet.lng,
                imageUrl: pet.imageUrl,
                status: pet.status
            });
        }

        res.json({
            message: 'Mascota reportada exitosamente',
            pet: {
                id: pet.id,
                name: pet.name,
                status: pet.status,
                location: pet.location,
                imageUrl: pet.imageUrl
            }
        });
    } catch (error) {
        console.error('Error creando mascota:', error);
        res.status(500).json({ error: 'Error al reportar mascota' });
    }
}

export async function getMyPets(req: AuthRequest, res: Response) {
    try {
        const pets = await Pet.findAll({
            where: { userId: req.userId },
            order: [['createdAt', 'DESC']]
        });

        res.json(pets);
    } catch (error) {
        console.error('Error obteniendo mascotas:', error);
        res.status(500).json({ error: 'Error al obtener mascotas' });
    }
}

export async function getPetById(req: Request, res: Response) {
    try {
        const pet = await Pet.findByPk(req.params.id, {
            include: [{ model: User, as: 'owner', attributes: ['id', 'name', 'email'] }]
        });

        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        res.json(pet);
    } catch (error) {
        console.error('Error obteniendo mascota:', error);
        res.status(500).json({ error: 'Error al obtener mascota' });
    }
}

export async function updatePet(req: AuthRequest, res: Response) {
    try {
        const pet = await Pet.findByPk(req.params.id);

        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        if (pet.userId !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para editar esta mascota' });
        }

        const { name, location, lat, lng, image, status } = req.body;

        let imageUrl: string | null = pet.imageUrl;
        if (image && image !== pet.imageUrl) {
            const uploaded = await uploadImage(image);
            if (uploaded) imageUrl = uploaded;
        }

        await pet.update({
            name: name || pet.name,
            location: location !== undefined ? location : pet.location,
            lat: lat !== undefined ? lat : pet.lat,
            lng: lng !== undefined ? lng : pet.lng,
            imageUrl,
            status: status || pet.status
        });

        if (pet.lat && pet.lng) {
            await updatePetInIndex({
                id: pet.id,
                name: pet.name,
                location: pet.location,
                lat: pet.lat,
                lng: pet.lng,
                imageUrl: pet.imageUrl,
                status: pet.status
            });
        }

        res.json({
            message: 'Mascota actualizada exitosamente',
            pet
        });
    } catch (error) {
        console.error('Error actualizando mascota:', error);
        res.status(500).json({ error: 'Error al actualizar mascota' });
    }
}

export async function deletePet(req: AuthRequest, res: Response) {
    try {
        const pet = await Pet.findByPk(req.params.id);

        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        if (pet.userId !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para eliminar esta mascota' });
        }

        await Report.destroy({ where: { petId: pet.id } });
        await deletePetFromIndex(pet.id);
        await pet.destroy();

        res.json({ message: 'Mascota eliminada exitosamente' });
    } catch (error) {
        console.error('Error eliminando mascota:', error);
        res.status(500).json({ error: 'Error al eliminar mascota' });
    }
}

export async function markAsFound(req: AuthRequest, res: Response) {
    try {
        const pet = await Pet.findByPk(req.params.id);

        if (!pet) {
            return res.status(404).json({ error: 'Mascota no encontrada' });
        }

        if (pet.userId !== req.userId) {
            return res.status(403).json({ error: 'No tienes permiso para modificar esta mascota' });
        }

        await pet.update({ status: 'found' });

        if (pet.lat && pet.lng) {
            await updatePetInIndex({
                id: pet.id,
                name: pet.name,
                location: pet.location,
                lat: pet.lat,
                lng: pet.lng,
                imageUrl: pet.imageUrl,
                status: 'found'
            });
        }

        res.json({ message: 'Mascota marcada como encontrada', pet });
    } catch (error) {
        console.error('Error marcando mascota como encontrada:', error);
        res.status(500).json({ error: 'Error al marcar mascota como encontrada' });
    }
}

export async function searchNearbyPets(req: Request, res: Response) {
    try {
        const { lat, lng, radius } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
        }

        const latNum = parseFloat(lat as string);
        const lngNum = parseFloat(lng as string);
        const radiusNum = radius ? parseInt(radius as string) : 10000;

        let pets;
        
        try {
            const hits = await searchPetsNearby(latNum, lngNum, radiusNum);
            
            if (hits && hits.length > 0) {
                const petIds = hits.map((hit: any) => parseInt(hit.objectID));
                pets = await Pet.findAll({
                    where: { id: petIds, status: 'lost' },
                    include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }]
                });
            } else {
                pets = await Pet.findAll({
                    where: { status: 'lost' },
                    include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
                    order: [['createdAt', 'DESC']],
                    limit: 20
                });
            }
        } catch (algoliaError) {
            console.log('Algolia no disponible, usando búsqueda local');
            pets = await Pet.findAll({
                where: { status: 'lost' },
                include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
                order: [['createdAt', 'DESC']],
                limit: 20
            });
        }

        res.json(pets);
    } catch (error) {
        console.error('Error buscando mascotas cercanas:', error);
        res.status(500).json({ error: 'Error al buscar mascotas cercanas' });
    }
}

export async function getAllLostPets(req: Request, res: Response) {
    try {
        const pets = await Pet.findAll({
            where: { status: 'lost' },
            include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
            order: [['createdAt', 'DESC']]
        });

        res.json(pets);
    } catch (error) {
        console.error('Error obteniendo mascotas perdidas:', error);
        res.status(500).json({ error: 'Error al obtener mascotas perdidas' });
    }
}

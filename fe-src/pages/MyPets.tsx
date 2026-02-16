import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { useToast } from '../hooks/useToast';
import { PetCard } from '../components/PetCard';
import { Title } from '../ui/Texts';
import { Button } from '../ui/Button';
import { Pet } from '../hooks/usePets';

export function MyPetsPage() {
    const { myPets, fetchMyPets } = usePets();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPets()
            .catch(() => showToast('Error al cargar tus mascotas', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const handleEdit = (pet: Pet) => {
        navigate(`/edit-pet?id=${pet.id}`);
    };

    return (
        <div className="page">
            <Title>Mascotas reportadas</Title>

            {loading && (
                <div className="loader">
                    <div className="loader__spinner"></div>
                </div>
            )}

            {!loading && myPets.length === 0 && (
                <div className="empty-state">
                    <img
                        src="/mascotas_reportadas1.webp"
                        alt="Sin mascotas"
                        className="empty-state__image"
                    />
                    <p className="empty-state__text">Aún no reportaste mascotas perdidas</p>
                </div>
            )}

            {!loading && myPets.length > 0 && (
                <div className="pets-list">
                    {myPets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            actionLabel="Editar ✏️"
                            actionVariant="edit"
                            onAction={handleEdit}
                        />
                    ))}
                </div>
            )}

            {!loading && (
                <Button className="mt-20" onClick={() => navigate('/report-pet')}>
                    Publicar reporte
                </Button>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../hooks/useLocation';
import { usePets } from '../hooks/usePets';
import { Button } from '../ui/Button';

export function HomePage() {
    const [loadingLocation, setLoadingLocation] = useState(false);
    const { requestLocation } = useLocation();
    const { fetchNearbyPets } = usePets();
    const navigate = useNavigate();

    const handleLocationClick = async () => {
        setLoadingLocation(true);
        try {
            const loc = await requestLocation();
            await fetchNearbyPets(loc.lat, loc.lng);
            navigate('/pets');
        } catch {
            alert(
                'No se pudo obtener tu ubicación. Por favor, habilita el acceso a la ubicación en tu navegador.'
            );
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <div className="page home">
            <img src="/imagen-inicio.webp" alt="Pet Finder" className="home__image" />
            <h1 className="home__title">Pet Finder App</h1>
            <p className="home__description">
                Encontrá y reportá mascotas perdidas cerca de tu ubicación
            </p>
            <Button
                onClick={handleLocationClick}
                loading={loadingLocation}
                loadingText="Obteniendo ubicación..."
            >
                Dar mi ubicación actual
            </Button>
            <Button variant="secondary" onClick={() => navigate('/how-it-works')}>
                ¿Cómo funciona Pet Finder?
            </Button>
        </div>
    );
}

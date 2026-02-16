import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { useToast } from '../hooks/useToast';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { MapComponent, reverseGeocode } from '../ui/Map';
import { Title } from '../ui/Texts';

export function EditPetPage() {
    const [searchParams] = useSearchParams();
    const petId = searchParams.get('id');
    const navigate = useNavigate();
    const { myPets, fetchMyPets, updatePet, deletePet, markPetAsFound } = usePets();
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [petImage, setPetImage] = useState<string | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
    } | null>(null);
    const [markerPos, setMarkerPos] = useState<{ lng: number; lat: number } | null>(null);
    const [locationText, setLocationText] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number]>([-58.3816, -34.6037]);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!petId) {
            navigate('/my-pets');
            return;
        }

        const init = async () => {
            let pets = myPets;
            if (pets.length === 0) {
                pets = await fetchMyPets();
            }

            const pet = pets.find((p: any) => p.id === parseInt(petId));
            if (!pet) {
                showToast('Mascota no encontrada', 'error');
                navigate('/my-pets');
                return;
            }

            setName(pet.name);
            setCurrentImageUrl(pet.imageUrl);
            setLocationText(pet.location || '');

            if (pet.lat && pet.lng) {
                setSelectedLocation({ lat: pet.lat, lng: pet.lng, address: pet.location || '' });
                setMarkerPos({ lng: pet.lng, lat: pet.lat });
                setMapCenter([pet.lng, pet.lat]);
            }

            setInitialized(true);
        };

        init();
    }, [petId]);

    const handleMapClick = useCallback(async (lng: number, lat: number) => {
        setMarkerPos({ lng, lat });
        const address = await reverseGeocode(lng, lat);
        setSelectedLocation({ lat, lng, address });
        setLocationText(address);
    }, []);

    const handleMarkerDrag = useCallback(async (lng: number, lat: number) => {
        const address = await reverseGeocode(lng, lat);
        setSelectedLocation({ lat, lng, address });
        setLocationText(address);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPetImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!petId) return;

        setLoading(true);
        try {
            await updatePet(parseInt(petId), {
                name,
                location: selectedLocation?.address || locationText,
                lat: selectedLocation?.lat,
                lng: selectedLocation?.lng,
                image: petImage || undefined,
            });
            showToast('¡Mascota actualizada!', 'success');
            navigate('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error al actualizar', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFound = async () => {
        if (!petId || !confirm('¿Confirmas que encontraste a tu mascota?')) return;
        try {
            await markPetAsFound(parseInt(petId));
            showToast('¡Genial! Nos alegra que hayas encontrado a tu mascota', 'success');
            navigate('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error', 'error');
        }
    };

    const handleDelete = async () => {
        if (!petId || !confirm('¿Estás seguro de eliminar este reporte?')) return;
        try {
            await deletePet(parseInt(petId));
            showToast('Reporte eliminado', 'success');
            navigate('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error al eliminar', 'error');
        }
    };

    if (!initialized) {
        return (
            <div className="page">
                <div className="loader">
                    <div className="loader__spinner"></div>
                </div>
            </div>
        );
    }

    const displayImage = petImage || currentImageUrl;

    return (
        <div className="page">
            <Title>Editar reporte de mascota</Title>
            <form className="form" onSubmit={handleSubmit}>
                <TextField
                    label="NOMBRE"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <div className="form__group">
                    <label className="form__label">FOTO</label>
                    <div
                        className="image-upload"
                        onClick={() => document.getElementById('edit-pet-image-input')?.click()}
                    >
                        {displayImage ? (
                            <img
                                src={displayImage}
                                className="image-upload__preview"
                                alt="Preview"
                            />
                        ) : (
                            <>
                                <span className="image-upload__icon">📷</span>
                                <span className="image-upload__text">Modificar foto</span>
                            </>
                        )}
                        <input
                            type="file"
                            id="edit-pet-image-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="form__group">
                    <label className="form__label">UBICACIÓN</label>
                    <MapComponent
                        center={mapCenter}
                        zoom={14}
                        markerPosition={markerPos}
                        draggable
                        onClick={handleMapClick}
                        onMarkerDragEnd={handleMarkerDrag}
                    />
                    <p className="location-text">
                        Buscá un punto de referencia para reportar la mascota. Por ejemplo, la
                        ubicación donde lo viste por última vez.
                    </p>
                </div>

                <TextField
                    label="UBICACIÓN"
                    type="text"
                    value={locationText}
                    readOnly
                />

                <Button type="submit" loading={loading} loadingText="Guardando...">
                    Guardar
                </Button>
                <Button type="button" variant="blue" onClick={handleFound}>
                    Reportar como encontrado
                </Button>
                <Button type="button" variant="danger" onClick={handleDelete}>
                    Eliminar reporte
                </Button>
            </form>
        </div>
    );
}

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { useToast } from '../hooks/useToast';
import { TextField, TextAreaField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { MapComponent, reverseGeocode } from '../ui/Map';
import { Title, Subtitle } from '../ui/Texts';

export function ReportPet() {
    const [name, setName] = useState('');
    const [characteristics, setCharacteristics] = useState('');
    const [description, setDescription] = useState('');
    const [petImage, setPetImage] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<{
        lat: number;
        lng: number;
        address: string;
    } | null>(null);
    const [markerPos, setMarkerPos] = useState<{ lng: number; lat: number } | null>(null);
    const [locationText, setLocationText] = useState('');
    const [loading, setLoading] = useState(false);

    const { createPet } = usePets();
    const { showToast } = useToast();
    const navigate = useNavigate();

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

        if (!selectedLocation) {
            showToast('Por favor, selecciona una ubicación en el mapa', 'error');
            return;
        }

        setLoading(true);

        try {
            await createPet({
                name,
                characteristics,
                description,
                location: selectedLocation.address,
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                image: petImage || undefined,
            });
            showToast('¡Mascota reportada exitosamente!', 'success');
            navigate('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error al reportar mascota', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <Title>Reportar mascota</Title>
            <Subtitle>
                Ingresá la siguiente información para realizar el reporte de la mascota
            </Subtitle>
            <form className="form" onSubmit={handleSubmit}>
                <TextField
                    label="NOMBRE"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nombre de la mascota"
                />
                <TextAreaField
                    label="CARACTERÍSTICAS"
                    value={characteristics}
                    onChange={(e) => setCharacteristics(e.target.value)}
                    placeholder="Ej: Color marrón, tamaño mediano, tiene collar azul, raza labrador..."
                    rows={3}
                />

                <div className="form__group">
                    <label className="form__label">FOTO</label>
                    <div
                        className="image-upload"
                        onClick={() => document.getElementById('pet-image-input')?.click()}
                    >
                        {petImage ? (
                            <img src={petImage} className="image-upload__preview" alt="Preview" />
                        ) : (
                            <>
                                <span className="image-upload__icon">📷</span>
                                <span className="image-upload__text">Agregar foto</span>
                            </>
                        )}
                        <input
                            type="file"
                            id="pet-image-input"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <div className="form__group">
                    <label className="form__label">UBICACIÓN</label>
                    <MapComponent
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
                    placeholder="Selecciona en el mapa"
                />

                <TextAreaField
                    label="DESCRIPCIÓN DEL LUGAR"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe el lugar donde se extravió. Ej: Cerca de la plaza principal, frente al supermercado..."
                    rows={3}
                />

                <Button type="submit" loading={loading} loadingText="Reportando...">
                    Reportar mascota
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/')}
                >
                    Cancelar
                </Button>
            </form>
        </div>
    );
}

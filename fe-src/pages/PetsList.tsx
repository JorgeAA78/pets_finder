import React, { useEffect, useState } from 'react';
import { usePets, Pet } from '../hooks/usePets';
import { useToast } from '../hooks/useToast';
import { PetCard } from '../components/PetCard';
import { Title } from '../ui/Texts';
import { Button } from '../ui/Button';
import { TextField, TextAreaField } from '../ui/TextField';

export function PetsListPage() {
    const { pets, fetchAllPets, createReport } = usePets();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [reporterName, setReporterName] = useState('');
    const [reporterPhone, setReporterPhone] = useState('');
    const [reportLocation, setReportLocation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAllPets()
            .catch(() => showToast('Error al cargar mascotas', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const handleReport = (pet: Pet) => {
        setSelectedPet(pet);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedPet(null);
        setReporterName('');
        setReporterPhone('');
        setReportLocation('');
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPet) return;

        setSubmitting(true);
        try {
            await createReport({
                petId: selectedPet.id,
                reporterName,
                reporterPhone,
                location: reportLocation,
                message: reportLocation,
            });
            showToast('¡Reporte enviado! El dueño será notificado.', 'success');
            handleCloseModal();
        } catch (error: any) {
            showToast(error.message || 'Error al enviar reporte', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page">
            <Title>Mascotas perdidas cerca</Title>

            {loading && (
                <div className="loader">
                    <div className="loader__spinner"></div>
                </div>
            )}

            {!loading && pets.length === 0 && (
                <div className="empty-state">
                    <img
                        src="/mascotas_cerca.webp"
                        alt="Sin mascotas"
                        className="empty-state__image"
                    />
                    <p className="empty-state__text">
                        No hay mascotas perdidas reportadas cerca de ti.
                    </p>
                </div>
            )}

            {!loading && pets.length > 0 && (
                <div className="pets-list">
                    {pets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            pet={pet}
                            actionLabel="Reportar 🐾"
                            actionVariant="report"
                            onAction={handleReport}
                        />
                    ))}
                </div>
            )}

            {/* Modal de reporte */}
            <div
                className={`modal-overlay ${modalOpen ? 'active' : ''}`}
                onClick={(e) => {
                    if (e.target === e.currentTarget) handleCloseModal();
                }}
            >
                <div className="modal">
                    <button className="modal__close" onClick={handleCloseModal}>
                        &times;
                    </button>
                    <h2 className="modal__title">
                        Reportar info de {selectedPet?.name}
                    </h2>
                    <form className="form" onSubmit={handleSubmitReport}>
                        <TextField
                            label="NOMBRE"
                            type="text"
                            value={reporterName}
                            onChange={(e) => setReporterName(e.target.value)}
                            required
                            placeholder="Tu nombre"
                        />
                        <TextField
                            label="TELÉFONO"
                            type="tel"
                            value={reporterPhone}
                            onChange={(e) => setReporterPhone(e.target.value)}
                            required
                            placeholder="Tu teléfono"
                        />
                        <TextAreaField
                            label="¿DÓNDE LO VISTE?"
                            value={reportLocation}
                            onChange={(e) => setReportLocation(e.target.value)}
                            rows={3}
                            placeholder="Describe la ubicación"
                        />
                        <Button type="submit" loading={submitting} loadingText="Enviando...">
                            Enviar información
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

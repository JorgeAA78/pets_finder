import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';

export function MyDataForm() {
    const { user, updateProfile } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [location, setLocation] = useState(user?.location || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateProfile({ name, location });
            showToast('Perfil actualizado', 'success');
            navigate('/profile');
        } catch (error: any) {
            showToast(error.message || 'Error al actualizar', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <TextField
                label="NOMBRE y APELLIDO"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
            />
            <TextField
                label="LOCALIDAD"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Tu ciudad"
            />
            <Button type="submit" loading={loading} loadingText="Guardando...">
                Guardar
            </Button>
        </form>
    );
}

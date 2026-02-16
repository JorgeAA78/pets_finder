import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { Title } from '../ui/Texts';

export function EditPasswordPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { updatePassword } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        setLoading(true);

        try {
            await updatePassword(currentPassword, newPassword);
            showToast('Contraseña actualizada', 'success');
            navigate('/profile');
        } catch (error: any) {
            showToast(error.message || 'Error al actualizar', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <Title>Contraseña</Title>
            <form className="form" onSubmit={handleSubmit}>
                <TextField
                    label="CONTRASEÑA ACTUAL"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />
                <TextField
                    label="NUEVA CONTRASEÑA"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <TextField
                    label="CONFIRMAR CONTRASEÑA"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <Button type="submit" loading={loading} loadingText="Guardando...">
                    Guardar
                </Button>
            </form>
        </div>
    );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';
import { Title, Subtitle } from '../ui/Texts';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        setLoading(true);

        try {
            await register(email, password);
            showToast('¡Registro exitoso!', 'success');
            navigate('/profile');
        } catch (error: any) {
            showToast(error.message || 'Error al registrarse', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page auth">
            <Title>Registrarse</Title>
            <Subtitle className="auth__subtitle">
                Ingresá los siguientes datos para realizar el registro
            </Subtitle>
            <form className="form" onSubmit={handleSubmit}>
                <TextField
                    label="EMAIL"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                />
                <TextField
                    label="CONTRASEÑA"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Button type="submit" loading={loading} loadingText="Registrando...">
                    Siguiente
                </Button>
            </form>
            <Link to="/login" className="form__link">
                Ya tenes una cuenta? Iniciar sesión.
            </Link>
        </div>
    );
}

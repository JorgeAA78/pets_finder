import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';

interface LoginFormProps {
    initialEmail?: string;
}

export function LoginForm({ initialEmail = '' }: LoginFormProps) {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            showToast('¡Bienvenido!', 'success');
            navigate('/');
        } catch (error: any) {
            showToast(error.message || 'Error al iniciar sesión', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <TextField
                label="EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <TextField
                label="CONTRASEÑA"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <a href="#" className="form__link" style={{ marginBottom: 20, marginTop: 0 }}>
                Olvidé mi contraseña
            </a>
            <Button type="submit" loading={loading} loadingText="Ingresando...">
                Acceder
            </Button>
        </form>
    );
}

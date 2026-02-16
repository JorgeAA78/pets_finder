import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from '../ui/TextField';
import { Button } from '../ui/Button';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/login-password?email=${encodeURIComponent(email)}`);
    };

    return (
        <div className="page auth">
            <img src="/pets_ingresando.webp" alt="Ingresar" className="auth__image" />
            <h1 className="auth__title">Ingresar</h1>
            <p className="auth__subtitle">Ingresá tu email para continuar.</p>
            <form className="form" onSubmit={handleSubmit}>
                <TextField
                    label="EMAIL"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="tu@email.com"
                />
                <Button type="submit">Siguiente</Button>
            </form>
            <Link to="/register" className="form__link">
                Aún no tenes cuenta? Registrate.
            </Link>
        </div>
    );
}

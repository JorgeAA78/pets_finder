import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { Title, Subtitle } from '../ui/Texts';

export function LoginPasswordPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';

    return (
        <div className="page auth">
            <Title>Iniciar Sesión</Title>
            <Subtitle className="auth__subtitle">
                Ingresá los siguientes datos para iniciar sesión
            </Subtitle>
            <LoginForm initialEmail={email} />
        </div>
    );
}

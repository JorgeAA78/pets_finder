import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Title } from '../ui/Texts';
import { Button } from '../ui/Button';

export function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="page profile">
            <Title>Mis datos</Title>
            <Button onClick={() => navigate('/edit-profile')}>
                Modificar datos personales
            </Button>
            <Button onClick={() => navigate('/edit-password')}>
                Modificar contraseña
            </Button>
            <p className="profile__email mt-20">{user?.email || ''}</p>
            <p className="profile__logout" onClick={handleLogout}>
                CERRAR SESIÓN
            </p>
        </div>
    );
}

import React from 'react';
import { MyDataForm } from '../components/MyDataForm';
import { Title } from '../ui/Texts';

export function EditProfilePage() {
    return (
        <div className="page">
            <Title>Datos personales</Title>
            <MyDataForm />
        </div>
    );
}

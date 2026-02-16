import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Title } from '../ui/Texts';
import { Button } from '../ui/Button';

const steps = [
    {
        number: 1,
        title: 'Reportar mascotas perdidas',
        text: 'Si perdiste a tu mascota, podés crear un reporte con su foto y la ubicación donde la viste por última vez.',
    },
    {
        number: 2,
        title: 'Ver mascotas perdidas cerca de tu ubicación',
        text: 'Activá tu ubicación para ver todas las mascotas perdidas que fueron reportadas cerca de donde estás.',
    },
    {
        number: 3,
        title: 'Reportar avistamientos de mascotas',
        text: 'Si ves una mascota perdida, podés enviar un reporte al dueño con tu información de contacto y dónde la viste.',
    },
    {
        number: 4,
        title: 'Recibir notificaciones cuando alguien vea tu mascota',
        text: 'Cada vez que alguien reporte haber visto a tu mascota, recibirás un email con los datos del avistamiento.',
    },
];

export function HowItWorksPage() {
    const navigate = useNavigate();

    return (
        <div className="page how-it-works">
            <Title>¿Cómo funciona Pet Finder?</Title>

            <div className="steps">
                {steps.map((step) => (
                    <div className="step" key={step.number}>
                        <div className="step__number">{step.number}</div>
                        <div className="step__content">
                            <h3 className="step__title">{step.title}</h3>
                            <p className="step__text">{step.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Button className="mt-20" onClick={() => navigate('/')}>
                Volver al inicio
            </Button>
        </div>
    );
}

import React from 'react';
import { Pet } from '../hooks/usePets';

interface PetCardProps {
    pet: Pet;
    actionLabel: string;
    actionVariant?: 'report' | 'edit';
    onAction: (pet: Pet) => void;
}

export function PetCard({ pet, actionLabel, actionVariant = 'report', onAction }: PetCardProps) {
    return (
        <div className="pet-card">
            <img
                src={pet.imageUrl || 'https://placehold.co/400x300/e0e0e0/666?text=Sin+foto'}
                alt={pet.name}
                className="pet-card__image"
            />
            <div className="pet-card__content">
                <h3 className="pet-card__name">{pet.name}</h3>
                <p className="pet-card__location">
                    {pet.location || 'Ubicación no especificada'}
                </p>
            </div>
            <div className="pet-card__actions">
                <button
                    className={`pet-card__btn pet-card__btn--${actionVariant}`}
                    onClick={() => onAction(pet)}
                >
                    {actionLabel}
                </button>
            </div>
        </div>
    );
}

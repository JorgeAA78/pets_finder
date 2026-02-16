import React from 'react';

interface TextProps {
    children: React.ReactNode;
    className?: string;
}

export function Title({ children, className = '' }: TextProps) {
    return <h1 className={`page__title ${className}`}>{children}</h1>;
}

export function Subtitle({ children, className = '' }: TextProps) {
    return <p className={`page__subtitle ${className}`}>{children}</p>;
}

export function Body({ children, className = '' }: TextProps) {
    return <p className={className}>{children}</p>;
}

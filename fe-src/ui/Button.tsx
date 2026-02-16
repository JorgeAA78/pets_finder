import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'blue';
    size?: 'default' | 'small';
    loading?: boolean;
    loadingText?: string;
}

export function Button({
    variant = 'primary',
    size = 'default',
    loading = false,
    loadingText,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const classes = [
        'btn',
        `btn--${variant}`,
        size === 'small' ? 'btn--small' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} disabled={disabled || loading} {...props}>
            {loading ? loadingText || 'Cargando...' : children}
        </button>
    );
}

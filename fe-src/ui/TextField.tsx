import React from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export function TextField({ label, ...props }: TextFieldProps) {
    return (
        <div className="form__group">
            <label className="form__label">{label}</label>
            <input className="form__input" {...props} />
        </div>
    );
}

export function TextAreaField({ label, ...props }: TextAreaFieldProps) {
    return (
        <div className="form__group">
            <label className="form__label">{label}</label>
            <textarea className="form__input form__textarea" {...props} />
        </div>
    );
}

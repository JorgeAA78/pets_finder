import React from 'react';
import { useRecoilValue } from 'recoil';
import { toastAtom } from '../hooks/useToast';

export function Toast() {
    const toast = useRecoilValue(toastAtom);

    return (
        <div
            className={`toast toast--${toast.type} ${toast.visible ? 'active' : ''}`}
        >
            {toast.message}
        </div>
    );
}

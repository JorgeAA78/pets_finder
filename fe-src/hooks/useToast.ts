import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';

interface ToastState {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

export const toastAtom = atom<ToastState>({
    key: 'toastAtom',
    default: {
        message: '',
        type: 'success',
        visible: false,
    },
});

export function useToast() {
    const [toast, setToast] = useRecoilState(toastAtom);

    const showToast = useCallback(
        (message: string, type: 'success' | 'error' = 'success') => {
            setToast({ message, type, visible: true });
            setTimeout(() => {
                setToast((prev) => ({ ...prev, visible: false }));
            }, 3000);
        },
        [setToast]
    );

    return { toast, showToast };
}

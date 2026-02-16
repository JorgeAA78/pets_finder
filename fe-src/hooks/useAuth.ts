import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';
import { loginApi, registerApi, fetchUserDataApi, updateProfileApi, updatePasswordApi } from '../lib/api';

export interface User {
    id: number;
    name: string;
    email: string;
    location: string;
    lat: number | null;
    lng: number | null;
}

export const userAtom = atom<User | null>({
    key: 'userAtom',
    default: null,
});

export const tokenAtom = atom<string | null>({
    key: 'tokenAtom',
    default: localStorage.getItem('token'),
});

export function useAuth() {
    const [user, setUser] = useRecoilState(userAtom);
    const [token, setToken] = useRecoilState(tokenAtom);

    const isAuthenticated = !!token && !!user;

    const initAuth = useCallback(async () => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            const userData = await fetchUserDataApi();
            if (userData) {
                setUser(userData);
            } else {
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        }
    }, [setToken, setUser]);

    const login = useCallback(
        async (email: string, password: string) => {
            const data = await loginApi(email, password);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            return data;
        },
        [setToken, setUser]
    );

    const register = useCallback(
        async (email: string, password: string, name?: string) => {
            const data = await registerApi(email, password, name);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            return data;
        },
        [setToken, setUser]
    );

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    }, [setToken, setUser]);

    const updateProfile = useCallback(
        async (data: { name?: string; location?: string; lat?: number; lng?: number }) => {
            const result = await updateProfileApi(data);
            setUser(result.user);
            return result;
        },
        [setUser]
    );

    const updatePassword = useCallback(
        async (currentPassword: string, newPassword: string) => {
            return await updatePasswordApi(currentPassword, newPassword);
        },
        []
    );

    return {
        user,
        token,
        isAuthenticated,
        initAuth,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
    };
}

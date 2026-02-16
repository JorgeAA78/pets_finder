import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { router } from './router/index.tsx';
import { useAuth } from './hooks/useAuth';
import './styles/main.scss';

function AppInitializer({ children }: { children: React.ReactNode }) {
    const { initAuth } = useAuth();

    useEffect(() => {
        initAuth();
    }, [initAuth]);

    return <>{children}</>;
}

function App() {
    return (
        <RecoilRoot>
            <AppInitializer>
                <RouterProvider router={router} future={{ v7_startTransition: true }} />
            </AppInitializer>
        </RecoilRoot>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/Home.tsx';
import { LoginPage } from '../pages/Login.tsx';
import { LoginPasswordPage } from '../pages/LoginPassword.tsx';
import { RegisterPage } from '../pages/Register.tsx';
import { PetsListPage } from '../pages/PetsList.tsx';
import { ReportPetPage } from '../pages/ReportPetPage.tsx';
import { EditPetPage } from '../pages/EditPet.tsx';
import { MyPetsPage } from '../pages/MyPets.tsx';
import { ProfilePage } from '../pages/Profile.tsx';
import { EditProfilePage } from '../pages/EditProfile.tsx';
import { EditPasswordPage } from '../pages/EditPassword.tsx';
import { HowItWorksPage } from '../pages/HowItWorks.tsx';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'login-password', element: <LoginPasswordPage /> },
            { path: 'register', element: <RegisterPage /> },
            { path: 'pets', element: <PetsListPage /> },
            { path: 'how-it-works', element: <HowItWorksPage /> },
            {
                path: 'report-pet',
                element: (
                    <ProtectedRoute>
                        <ReportPetPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'edit-pet',
                element: (
                    <ProtectedRoute>
                        <EditPetPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'my-pets',
                element: (
                    <ProtectedRoute>
                        <MyPetsPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'profile',
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'edit-profile',
                element: (
                    <ProtectedRoute>
                        <EditProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'edit-password',
                element: (
                    <ProtectedRoute>
                        <EditPasswordPage />
                    </ProtectedRoute>
                ),
            },
            { path: '*', element: <Navigate to="/" replace /> },
        ],
    },
]);

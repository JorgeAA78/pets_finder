import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from './Toast';

export function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <Toast />
        </>
    );
}

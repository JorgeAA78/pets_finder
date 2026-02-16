import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const openMenu = () => setMenuOpen(true);
    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/');
    };

    return (
        <>
            <header className="header">
                <Link to="/" className="header__logo-link">
                    <img src="/logo.webp" alt="Pet Finder Logo" className="header__logo" />
                </Link>
                <button className="header__menu-btn" onClick={openMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </header>

            <div
                className={`menu-overlay ${menuOpen ? 'active' : ''}`}
                onClick={closeMenu}
            />

            <nav className={`menu ${menuOpen ? 'active' : ''}`}>
                <button className="menu__close" onClick={closeMenu}>
                    &times;
                </button>
                <ul className="menu__list">
                    <li className="menu__item">
                        <Link to="/" onClick={closeMenu}>Inicio</Link>
                    </li>
                    <li className="menu__item">
                        <Link to="/pets" onClick={closeMenu}>Mascotas perdidas</Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="menu__item">
                                <Link to="/my-pets" onClick={closeMenu}>Mis reportes</Link>
                            </li>
                            <li className="menu__item">
                                <Link to="/report-pet" onClick={closeMenu}>Reportar mascota</Link>
                            </li>
                            <li className="menu__item">
                                <Link to="/profile" onClick={closeMenu}>Mi perfil</Link>
                            </li>
                        </>
                    ) : (
                        <li className="menu__item">
                            <Link to="/login" onClick={closeMenu}>Iniciar sesión</Link>
                        </li>
                    )}
                </ul>
                {isAuthenticated && (
                    <p className="menu__logout" onClick={handleLogout}>
                        CERRAR SESIÓN
                    </p>
                )}
            </nav>
        </>
    );
}

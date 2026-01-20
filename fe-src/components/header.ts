import { state, logout, isAuthenticated } from '../state';
import { navigateTo } from '../router';

export function renderHeader(): string {
    return `
        <header class="header">
            <a href="#/" class="header__logo-link"><img src="/logo.webp" alt="Pet Finder Logo" class="header__logo"></a>
            <button class="header__menu-btn" id="menu-btn">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </header>
        <div class="menu-overlay" id="menu-overlay"></div>
        <nav class="menu" id="menu">
            <button class="menu__close" id="menu-close">&times;</button>
            <ul class="menu__list">
                <li class="menu__item"><a href="#/">Inicio</a></li>
                <li class="menu__item"><a href="#/pets">Mascotas perdidas</a></li>
                ${isAuthenticated() ? `
                    <li class="menu__item"><a href="#/my-pets">Mis reportes</a></li>
                    <li class="menu__item"><a href="#/report-pet">Reportar mascota</a></li>
                    <li class="menu__item"><a href="#/profile">Mi perfil</a></li>
                ` : `
                    <li class="menu__item"><a href="#/login">Iniciar sesión</a></li>
                `}
            </ul>
            ${isAuthenticated() ? `
                <p class="menu__logout" id="logout-btn">CERRAR SESIÓN</p>
            ` : ''}
        </nav>
    `;
}

export function initHeaderEvents() {
    const menuBtn = document.getElementById('menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');
    const menu = document.getElementById('menu');
    const menuClose = document.getElementById('menu-close');
    const logoutBtn = document.getElementById('logout-btn');

    function openMenu() {
        menu?.classList.add('active');
        menuOverlay?.classList.add('active');
    }

    function closeMenu() {
        menu?.classList.remove('active');
        menuOverlay?.classList.remove('active');
    }

    menuBtn?.addEventListener('click', openMenu);
    menuOverlay?.addEventListener('click', closeMenu);
    menuClose?.addEventListener('click', closeMenu);

    menu?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    logoutBtn?.addEventListener('click', () => {
        logout();
        closeMenu();
        navigateTo('/');
    });
}

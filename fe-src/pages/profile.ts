import { renderHeader, initHeaderEvents } from '../components/header';
import { state, logout } from '../state';
import { navigateTo } from '../router';

export function renderProfilePage() {
    const app = document.getElementById('app');
    if (!app) return;

    const user = state.user;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page profile">
            <h1 class="page__title">Mis datos</h1>
            <button class="btn btn--primary" id="edit-profile-btn">
                Modificar datos personales
            </button>
            <button class="btn btn--primary" id="edit-password-btn">
                Modificar contraseña
            </button>
            <p class="profile__email mt-20">${user?.email || ''}</p>
            <p class="profile__logout" id="logout-btn">CERRAR SESIÓN</p>
        </div>
    `;

    initHeaderEvents();
    initProfileEvents();
}

function initProfileEvents() {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const editPasswordBtn = document.getElementById('edit-password-btn');
    const logoutBtn = document.getElementById('logout-btn');

    editProfileBtn?.addEventListener('click', () => {
        navigateTo('/edit-profile');
    });

    editPasswordBtn?.addEventListener('click', () => {
        navigateTo('/edit-password');
    });

    logoutBtn?.addEventListener('click', () => {
        logout();
        navigateTo('/');
    });
}

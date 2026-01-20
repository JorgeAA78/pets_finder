import { renderHeader, initHeaderEvents } from '../components/header';
import { showToast } from '../components/toast';
import { state, updateProfile } from '../state';
import { navigateTo } from '../router';

export function renderEditProfilePage() {
    const app = document.getElementById('app');
    if (!app) return;

    const user = state.user;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page">
            <h1 class="page__title">Datos personales</h1>
            <form class="form" id="edit-profile-form">
                <div class="form__group">
                    <label class="form__label">NOMBRE y APELLIDO</label>
                    <input type="text" class="form__input" id="name-input" value="${user?.name || ''}" placeholder="Tu nombre">
                </div>
                <div class="form__group">
                    <label class="form__label">LOCALIDAD</label>
                    <input type="text" class="form__input" id="location-input" value="${user?.location || ''}" placeholder="Tu ciudad">
                </div>
                <button type="submit" class="btn btn--primary" id="save-btn">Guardar</button>
            </form>
        </div>
    `;

    initHeaderEvents();
    initEditProfileEvents();
}

function initEditProfileEvents() {
    const form = document.getElementById('edit-profile-form');
    const saveBtn = document.getElementById('save-btn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name-input') as HTMLInputElement;
        const locationInput = document.getElementById('location-input') as HTMLInputElement;

        if (saveBtn) {
            saveBtn.textContent = 'Guardando...';
            saveBtn.setAttribute('disabled', 'true');
        }

        try {
            await updateProfile({
                name: nameInput.value,
                location: locationInput.value
            });

            showToast('Perfil actualizado', 'success');
            navigateTo('/profile');
        } catch (error: any) {
            showToast(error.message || 'Error al actualizar', 'error');
            if (saveBtn) {
                saveBtn.textContent = 'Guardar';
                saveBtn.removeAttribute('disabled');
            }
        }
    });
}

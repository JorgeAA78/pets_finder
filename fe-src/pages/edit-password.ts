import { renderHeader, initHeaderEvents } from '../components/header';
import { showToast } from '../components/toast';
import { updatePassword } from '../state';
import { navigateTo } from '../router';

export function renderEditPasswordPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page">
            <h1 class="page__title">Contraseña</h1>
            <form class="form" id="edit-password-form">
                <div class="form__group">
                    <label class="form__label">CONTRASEÑA ACTUAL</label>
                    <input type="password" class="form__input" id="current-password" required>
                </div>
                <div class="form__group">
                    <label class="form__label">NUEVA CONTRASEÑA</label>
                    <input type="password" class="form__input" id="new-password" required minlength="6">
                </div>
                <div class="form__group">
                    <label class="form__label">CONFIRMAR CONTRASEÑA</label>
                    <input type="password" class="form__input" id="confirm-password" required>
                </div>
                <button type="submit" class="btn btn--primary" id="save-btn">Guardar</button>
            </form>
        </div>
    `;

    initHeaderEvents();
    initEditPasswordEvents();
}

function initEditPasswordEvents() {
    const form = document.getElementById('edit-password-form');
    const saveBtn = document.getElementById('save-btn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPasswordInput = document.getElementById('current-password') as HTMLInputElement;
        const newPasswordInput = document.getElementById('new-password') as HTMLInputElement;
        const confirmPasswordInput = document.getElementById('confirm-password') as HTMLInputElement;

        if (newPasswordInput.value !== confirmPasswordInput.value) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        if (saveBtn) {
            saveBtn.textContent = 'Guardando...';
            saveBtn.setAttribute('disabled', 'true');
        }

        try {
            await updatePassword(currentPasswordInput.value, newPasswordInput.value);
            showToast('Contraseña actualizada', 'success');
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

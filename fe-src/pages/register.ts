import { renderHeader, initHeaderEvents } from '../components/header';
import { showToast } from '../components/toast';
import { register } from '../state';
import { navigateTo } from '../router';

export function renderRegisterPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page auth">
            <h1 class="page__title">Registrarse</h1>
            <p class="auth__subtitle">Ingresá los siguientes datos para realizar el registro</p>
            <form class="form" id="register-form">
                <div class="form__group">
                    <label class="form__label">EMAIL</label>
                    <input type="email" class="form__input" id="email-input" required placeholder="tu@email.com">
                </div>
                <div class="form__group">
                    <label class="form__label">CONTRASEÑA</label>
                    <input type="password" class="form__input" id="password-input" required minlength="6">
                </div>
                <div class="form__group">
                    <label class="form__label">CONFIRMAR CONTRASEÑA</label>
                    <input type="password" class="form__input" id="confirm-password-input" required>
                </div>
                <button type="submit" class="btn btn--primary" id="register-btn">Siguiente</button>
            </form>
            <a href="#/login" class="form__link">Ya tenes una cuenta? Iniciar sesión.</a>
        </div>
    `;

    initHeaderEvents();
    initRegisterEvents();
}

function initRegisterEvents() {
    const form = document.getElementById('register-form');
    const registerBtn = document.getElementById('register-btn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email-input') as HTMLInputElement;
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        const confirmPasswordInput = document.getElementById('confirm-password-input') as HTMLInputElement;

        if (passwordInput.value !== confirmPasswordInput.value) {
            showToast('Las contraseñas no coinciden', 'error');
            return;
        }

        if (registerBtn) {
            registerBtn.textContent = 'Registrando...';
            registerBtn.setAttribute('disabled', 'true');
        }

        try {
            await register(emailInput.value, passwordInput.value);
            showToast('¡Registro exitoso!', 'success');
            navigateTo('/profile');
        } catch (error: any) {
            showToast(error.message || 'Error al registrarse', 'error');
            if (registerBtn) {
                registerBtn.textContent = 'Siguiente';
                registerBtn.removeAttribute('disabled');
            }
        }
    });
}

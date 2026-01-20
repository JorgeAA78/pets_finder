import { renderHeader, initHeaderEvents } from '../components/header';
import { showToast } from '../components/toast';
import { login } from '../state';
import { navigateTo } from '../router';

let tempEmail = '';

export function renderLoginPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page auth">
            <img src="/pets-ingresando.webp" alt="Ingresar" class="auth__image">
            <h1 class="auth__title">Ingresar</h1>
            <p class="auth__subtitle">Ingresá tu email para continuar.</p>
            <form class="form" id="email-form">
                <div class="form__group">
                    <label class="form__label">EMAIL</label>
                    <input type="email" class="form__input" id="email-input" required placeholder="tu@email.com">
                </div>
                <button type="submit" class="btn btn--primary">Siguiente</button>
            </form>
            <a href="#/register" class="form__link">Aún no tenes cuenta? Registrate.</a>
        </div>
    `;

    initHeaderEvents();
    initLoginEvents();
}

function initLoginEvents() {
    const form = document.getElementById('email-form');
    
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('email-input') as HTMLInputElement;
        tempEmail = emailInput.value;
        navigateTo('/login-password?email=' + encodeURIComponent(tempEmail));
    });
}

export function renderLoginPasswordPage() {
    const app = document.getElementById('app');
    if (!app) return;

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const email = urlParams.get('email') || tempEmail;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page auth">
            <h1 class="page__title">Iniciar Sesión</h1>
            <p class="auth__subtitle">Ingresá los siguientes datos para iniciar sesión</p>
            <form class="form" id="login-form">
                <div class="form__group">
                    <label class="form__label">EMAIL</label>
                    <input type="email" class="form__input" id="email-input" value="${email}" required>
                </div>
                <div class="form__group">
                    <label class="form__label">CONTRASEÑA</label>
                    <input type="password" class="form__input" id="password-input" required>
                </div>
                <a href="#" class="form__link" style="margin-bottom: 20px; margin-top: 0;">Olvidé mi contraseña</a>
                <button type="submit" class="btn btn--primary" id="login-btn">Acceder</button>
            </form>
        </div>
    `;

    initHeaderEvents();
    initPasswordEvents();
}

function initPasswordEvents() {
    const form = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email-input') as HTMLInputElement;
        const passwordInput = document.getElementById('password-input') as HTMLInputElement;
        
        if (loginBtn) {
            loginBtn.textContent = 'Ingresando...';
            loginBtn.setAttribute('disabled', 'true');
        }

        try {
            await login(emailInput.value, passwordInput.value);
            showToast('¡Bienvenido!', 'success');
            navigateTo('/');
        } catch (error: any) {
            showToast(error.message || 'Error al iniciar sesión', 'error');
            if (loginBtn) {
                loginBtn.textContent = 'Acceder';
                loginBtn.removeAttribute('disabled');
            }
        }
    });
}

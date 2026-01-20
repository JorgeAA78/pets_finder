import { renderHeader, initHeaderEvents } from '../components/header';
import { setCurrentLocation, fetchNearbyPets, isAuthenticated } from '../state';
import { navigateTo } from '../router';

export function renderHomePage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page home">
            <img src="/imagen-inicio.webp" alt="Pet Finder" class="home__image">
            <h1 class="home__title">Pet Finder App</h1>
            <p class="home__description">
                Encontrá y reportá mascotas perdidas cerca de tu ubicación
            </p>
            <button class="btn btn--primary" id="location-btn">
                Dar mi ubicación actual
            </button>
            <button class="btn btn--secondary" id="how-it-works-btn">
                ¿Cómo funciona Pet Finder?
            </button>
        </div>
    `;

    initHeaderEvents();
    initHomeEvents();
}

function initHomeEvents() {
    const locationBtn = document.getElementById('location-btn');
    const howItWorksBtn = document.getElementById('how-it-works-btn');

    locationBtn?.addEventListener('click', async () => {
        locationBtn.textContent = 'Obteniendo ubicación...';
        locationBtn.setAttribute('disabled', 'true');

        try {
            const position = await getCurrentPosition();
            setCurrentLocation(position.coords.latitude, position.coords.longitude);
            await fetchNearbyPets(position.coords.latitude, position.coords.longitude);
            navigateTo('/pets');
        } catch (error) {
            alert('No se pudo obtener tu ubicación. Por favor, habilita el acceso a la ubicación en tu navegador.');
            locationBtn.textContent = 'Dar mi ubicación actual';
            locationBtn.removeAttribute('disabled');
        }
    });

    howItWorksBtn?.addEventListener('click', () => {
        navigateTo('/how-it-works');
    });
}

function getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    });
}

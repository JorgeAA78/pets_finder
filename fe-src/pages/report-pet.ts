import { renderHeader, initHeaderEvents } from '../components/header';
import { showToast } from '../components/toast';
import { createPet } from '../state';
import { navigateTo } from '../router';
import { initMap, addMarker, onMapClick, onMarkerDragEnd, reverseGeocode, destroyMap } from '../components/map';

let selectedLocation: { lat: number; lng: number; address: string } | null = null;
let petImage: string | null = null;

export function renderReportPetPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page">
            <h1 class="page__title">Reportar mascota</h1>
            <p class="page__subtitle">Ingresá la siguiente información para realizar el reporte de la mascota</p>
            <form class="form" id="report-pet-form">
                <div class="form__group">
                    <label class="form__label">NOMBRE</label>
                    <input type="text" class="form__input" id="pet-name" required placeholder="Nombre de la mascota">
                </div>
                <div class="form__group">
                    <label class="form__label">CARACTERÍSTICAS</label>
                    <textarea class="form__input form__textarea" id="pet-characteristics" placeholder="Ej: Color marrón, tamaño mediano, tiene collar azul, raza labrador..." rows="3"></textarea>
                </div>
                <div class="form__group">
                    <label class="form__label">FOTO</label>
                    <div class="image-upload" id="image-upload">
                        <span class="image-upload__icon">📷</span>
                        <span class="image-upload__text">Agregar foto</span>
                        <input type="file" id="pet-image" accept="image/*">
                    </div>
                </div>
                <div class="form__group">
                    <label class="form__label">UBICACIÓN</label>
                    <div class="map-container">
                        <div id="map"></div>
                    </div>
                    <p class="location-text" id="location-text">
                        Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.
                    </p>
                </div>
                <div class="form__group">
                    <label class="form__label">UBICACIÓN</label>
                    <input type="text" class="form__input" id="location-input" readonly placeholder="Selecciona en el mapa">
                </div>
                <div class="form__group">
                    <label class="form__label">DESCRIPCIÓN DEL LUGAR</label>
                    <textarea class="form__input form__textarea" id="pet-description" placeholder="Describe el lugar donde se extravió. Ej: Cerca de la plaza principal, frente al supermercado..." rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn--primary" id="submit-btn">Reportar mascota</button>
                <button type="button" class="btn btn--secondary" id="cancel-btn">Cancelar</button>
            </form>
        </div>
    `;

    initHeaderEvents();
    initReportPetEvents();
    initMapComponent();
}

function initMapComponent() {
    setTimeout(() => {
        const map = initMap('map');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                map.setCenter([longitude, latitude]);
                map.setZoom(14);
            });
        }

        onMapClick(async (lng, lat) => {
            addMarker(lng, lat, true);
            const address = await reverseGeocode(lng, lat);
            selectedLocation = { lat, lng, address };
            updateLocationInput(address);
            
            onMarkerDragEnd(async (newLng, newLat) => {
                const newAddress = await reverseGeocode(newLng, newLat);
                selectedLocation = { lat: newLat, lng: newLng, address: newAddress };
                updateLocationInput(newAddress);
            });
        });
    }, 100);
}

function updateLocationInput(address: string) {
    const input = document.getElementById('location-input') as HTMLInputElement;
    if (input) input.value = address;
}

function initReportPetEvents() {
    const form = document.getElementById('report-pet-form');
    const imageUpload = document.getElementById('image-upload');
    const imageInput = document.getElementById('pet-image') as HTMLInputElement;
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');

    imageUpload?.addEventListener('click', () => imageInput?.click());

    imageInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                petImage = e.target?.result as string;
                if (imageUpload) {
                    imageUpload.innerHTML = `<img src="${petImage}" class="image-upload__preview" alt="Preview">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    cancelBtn?.addEventListener('click', () => {
        destroyMap();
        navigateTo('/');
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('pet-name') as HTMLInputElement;
        const characteristicsInput = document.getElementById('pet-characteristics') as HTMLTextAreaElement;
        const descriptionInput = document.getElementById('pet-description') as HTMLTextAreaElement;
        
        if (!selectedLocation) {
            showToast('Por favor, selecciona una ubicación en el mapa', 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.textContent = 'Reportando...';
            submitBtn.setAttribute('disabled', 'true');
        }

        try {
            await createPet({
                name: nameInput.value,
                characteristics: characteristicsInput?.value || '',
                description: descriptionInput?.value || '',
                location: selectedLocation.address,
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                image: petImage || undefined
            });

            destroyMap();
            showToast('¡Mascota reportada exitosamente!', 'success');
            navigateTo('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error al reportar mascota', 'error');
            if (submitBtn) {
                submitBtn.textContent = 'Reportar mascota';
                submitBtn.removeAttribute('disabled');
            }
        }
    });
}

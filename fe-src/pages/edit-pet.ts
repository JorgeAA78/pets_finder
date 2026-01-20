import { renderHeader, initHeaderEvents } from '../components/header';
import { showToast } from '../components/toast';
import { state, updatePet, deletePet, markPetAsFound, fetchMyPets } from '../state';
import { navigateTo, getParams } from '../router';
import { initMap, addMarker, onMapClick, onMarkerDragEnd, reverseGeocode, destroyMap, setMapCenter } from '../components/map';

let selectedLocation: { lat: number; lng: number; address: string } | null = null;
let petImage: string | null = null;
let currentPet: any = null;

export async function renderEditPetPage() {
    const app = document.getElementById('app');
    if (!app) return;

    const params = getParams();
    const petId = params.get('id');

    if (!petId) {
        navigateTo('/my-pets');
        return;
    }

    if (state.myPets.length === 0) {
        await fetchMyPets();
    }

    currentPet = state.myPets.find(p => p.id === parseInt(petId));
    
    if (!currentPet) {
        showToast('Mascota no encontrada', 'error');
        navigateTo('/my-pets');
        return;
    }

    selectedLocation = currentPet.lat && currentPet.lng ? {
        lat: currentPet.lat,
        lng: currentPet.lng,
        address: currentPet.location || ''
    } : null;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page">
            <h1 class="page__title">Editar reporte de mascota</h1>
            <form class="form" id="edit-pet-form">
                <div class="form__group">
                    <label class="form__label">NOMBRE</label>
                    <input type="text" class="form__input" id="pet-name" value="${currentPet.name}" required>
                </div>
                <div class="form__group">
                    <label class="form__label">FOTO</label>
                    <div class="image-upload" id="image-upload">
                        ${currentPet.imageUrl 
                            ? `<img src="${currentPet.imageUrl}" class="image-upload__preview" alt="Preview">`
                            : `<span class="image-upload__icon">📷</span><span class="image-upload__text">Modificar foto</span>`
                        }
                        <input type="file" id="pet-image" accept="image/*">
                    </div>
                </div>
                <div class="form__group">
                    <label class="form__label">UBICACIÓN</label>
                    <div class="map-container">
                        <div id="map"></div>
                    </div>
                    <p class="location-text">
                        Buscá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.
                    </p>
                </div>
                <div class="form__group">
                    <label class="form__label">UBICACIÓN</label>
                    <input type="text" class="form__input" id="location-input" value="${currentPet.location || ''}" readonly>
                </div>
                <button type="submit" class="btn btn--primary" id="save-btn">Guardar</button>
                <button type="button" class="btn btn--blue" id="found-btn">Reportar como encontrado</button>
                <button type="button" class="btn btn--danger" id="delete-btn">Eliminar reporte</button>
            </form>
        </div>
    `;

    initHeaderEvents();
    initEditPetEvents();
    initMapComponent();
}

function initMapComponent() {
    setTimeout(() => {
        const centerLng = currentPet?.lng || -58.3816;
        const centerLat = currentPet?.lat || -34.6037;
        
        initMap('map', [centerLng, centerLat], 14);
        
        if (currentPet?.lat && currentPet?.lng) {
            addMarker(currentPet.lng, currentPet.lat, true);
            
            onMarkerDragEnd(async (newLng, newLat) => {
                const newAddress = await reverseGeocode(newLng, newLat);
                selectedLocation = { lat: newLat, lng: newLng, address: newAddress };
                updateLocationInput(newAddress);
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

function initEditPetEvents() {
    const form = document.getElementById('edit-pet-form');
    const imageUpload = document.getElementById('image-upload');
    const imageInput = document.getElementById('pet-image') as HTMLInputElement;
    const saveBtn = document.getElementById('save-btn');
    const foundBtn = document.getElementById('found-btn');
    const deleteBtn = document.getElementById('delete-btn');

    imageUpload?.addEventListener('click', () => imageInput?.click());

    imageInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                petImage = e.target?.result as string;
                if (imageUpload) {
                    imageUpload.innerHTML = `<img src="${petImage}" class="image-upload__preview" alt="Preview">
                    <input type="file" id="pet-image" accept="image/*">`;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('pet-name') as HTMLInputElement;

        if (saveBtn) {
            saveBtn.textContent = 'Guardando...';
            saveBtn.setAttribute('disabled', 'true');
        }

        try {
            await updatePet(currentPet.id, {
                name: nameInput.value,
                location: selectedLocation?.address || currentPet.location,
                lat: selectedLocation?.lat || currentPet.lat,
                lng: selectedLocation?.lng || currentPet.lng,
                image: petImage || undefined
            });

            destroyMap();
            showToast('¡Mascota actualizada!', 'success');
            navigateTo('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error al actualizar', 'error');
            if (saveBtn) {
                saveBtn.textContent = 'Guardar';
                saveBtn.removeAttribute('disabled');
            }
        }
    });

    foundBtn?.addEventListener('click', async () => {
        if (!confirm('¿Confirmas que encontraste a tu mascota?')) return;
        
        try {
            await markPetAsFound(currentPet.id);
            destroyMap();
            showToast('¡Genial! Nos alegra que hayas encontrado a tu mascota', 'success');
            navigateTo('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error', 'error');
        }
    });

    deleteBtn?.addEventListener('click', async () => {
        if (!confirm('¿Estás seguro de eliminar este reporte?')) return;
        
        try {
            await deletePet(currentPet.id);
            destroyMap();
            showToast('Reporte eliminado', 'success');
            navigateTo('/my-pets');
        } catch (error: any) {
            showToast(error.message || 'Error al eliminar', 'error');
        }
    });
}

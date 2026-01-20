import { renderHeader, initHeaderEvents } from '../components/header';
import { state, fetchMyPets } from '../state';
import { showToast } from '../components/toast';
import { navigateTo } from '../router';

export async function renderMyPetsPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page">
            <h1 class="page__title">Mascotas reportadas</h1>
            <div class="loader" id="loader">
                <div class="loader__spinner"></div>
            </div>
            <div class="pets-list" id="pets-list"></div>
            <button class="btn btn--primary mt-20" id="new-report-btn" style="display: none;">
                Publicar reporte
            </button>
        </div>
    `;

    initHeaderEvents();
    await loadMyPets();
}

async function loadMyPets() {
    const loader = document.getElementById('loader');
    const petsList = document.getElementById('pets-list');
    const newReportBtn = document.getElementById('new-report-btn');

    try {
        await fetchMyPets();
        
        if (loader) loader.style.display = 'none';
        if (newReportBtn) newReportBtn.style.display = 'block';
        
        if (state.myPets.length === 0) {
            if (petsList) {
                petsList.innerHTML = `
                    <div class="empty-state">
                        <img src="/mascotas-reportadas1.webp" alt="Sin mascotas" class="empty-state__image">
                        <p class="empty-state__text">Aún no reportaste mascotas perdidas</p>
                    </div>
                `;
            }
        } else {
            if (petsList) {
                petsList.innerHTML = state.myPets.map(pet => `
                    <div class="pet-card" data-pet-id="${pet.id}">
                        <img src="${pet.imageUrl || 'https://placehold.co/400x300/e0e0e0/666?text=Sin+foto'}" alt="${pet.name}" class="pet-card__image">
                        <div class="pet-card__content">
                            <h3 class="pet-card__name">${pet.name}</h3>
                            <p class="pet-card__location">${pet.location || 'Ubicación no especificada'}</p>
                        </div>
                        <div class="pet-card__actions">
                            <button class="pet-card__btn pet-card__btn--edit" data-pet-id="${pet.id}">
                                Editar ✏️
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        initMyPetsEvents();
    } catch (error) {
        if (loader) loader.style.display = 'none';
        showToast('Error al cargar tus mascotas', 'error');
    }
}

function initMyPetsEvents() {
    const newReportBtn = document.getElementById('new-report-btn');
    
    newReportBtn?.addEventListener('click', () => {
        navigateTo('/report-pet');
    });

    document.querySelectorAll('.pet-card__btn--edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const petId = target.dataset.petId;
            navigateTo(`/edit-pet?id=${petId}`);
        });
    });
}

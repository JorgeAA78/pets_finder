import { renderHeader, initHeaderEvents } from '../components/header';
import { state, fetchAllPets, createReport } from '../state';
import { showToast } from '../components/toast';

export async function renderPetsListPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page">
            <h1 class="page__title">Mascotas perdidas cerca</h1>
            <div class="loader" id="loader">
                <div class="loader__spinner"></div>
            </div>
            <div class="pets-list" id="pets-list"></div>
        </div>
        <div class="modal-overlay" id="report-modal">
            <div class="modal">
                <button class="modal__close" id="modal-close">&times;</button>
                <h2 class="modal__title" id="modal-title">Reportar info de mascota</h2>
                <form class="form" id="report-form">
                    <input type="hidden" id="pet-id">
                    <div class="form__group">
                        <label class="form__label">NOMBRE</label>
                        <input type="text" class="form__input" id="reporter-name" required placeholder="Tu nombre">
                    </div>
                    <div class="form__group">
                        <label class="form__label">TELÉFONO</label>
                        <input type="tel" class="form__input" id="reporter-phone" required placeholder="Tu teléfono">
                    </div>
                    <div class="form__group">
                        <label class="form__label">¿DÓNDE LO VISTE?</label>
                        <textarea class="form__input" id="report-location" rows="3" placeholder="Describe la ubicación"></textarea>
                    </div>
                    <button type="submit" class="btn btn--primary">Enviar información</button>
                </form>
            </div>
        </div>
    `;

    initHeaderEvents();
    await loadPets();
    initPetsListEvents();
}

async function loadPets() {
    const loader = document.getElementById('loader');
    const petsList = document.getElementById('pets-list');

    try {
        await fetchAllPets();
        
        if (loader) loader.style.display = 'none';
        
        if (state.pets.length === 0) {
            if (petsList) {
                petsList.innerHTML = `
                    <div class="empty-state">
                        <img src="/mascotas-cerca.webp" alt="Sin mascotas" class="empty-state__image">
                        <p class="empty-state__text">No hay mascotas perdidas reportadas cerca de ti.</p>
                    </div>
                `;
            }
            return;
        }

        if (petsList) {
            petsList.innerHTML = state.pets.map(pet => `
                <div class="pet-card" data-pet-id="${pet.id}">
                    <img src="${pet.imageUrl || 'https://placehold.co/400x300/e0e0e0/666?text=Sin+foto'}" alt="${pet.name}" class="pet-card__image">
                    <div class="pet-card__content">
                        <h3 class="pet-card__name">${pet.name}</h3>
                        <p class="pet-card__location">${pet.location || 'Ubicación no especificada'}</p>
                    </div>
                    <div class="pet-card__actions">
                        <button class="pet-card__btn pet-card__btn--report" data-pet-id="${pet.id}" data-pet-name="${pet.name}">
                            Reportar 🐾
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        if (loader) loader.style.display = 'none';
        showToast('Error al cargar mascotas', 'error');
    }
}

function initPetsListEvents() {
    const modal = document.getElementById('report-modal');
    const modalClose = document.getElementById('modal-close');
    const reportForm = document.getElementById('report-form');
    const petIdInput = document.getElementById('pet-id') as HTMLInputElement;
    const modalTitle = document.getElementById('modal-title');

    document.querySelectorAll('.pet-card__btn--report').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget as HTMLElement;
            const petId = target.dataset.petId;
            const petName = target.dataset.petName;
            
            if (petIdInput) petIdInput.value = petId || '';
            if (modalTitle) modalTitle.textContent = `Reportar info de ${petName}`;
            modal?.classList.add('active');
        });
    });

    modalClose?.addEventListener('click', () => {
        modal?.classList.remove('active');
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    reportForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const petId = parseInt(petIdInput.value);
        const reporterName = (document.getElementById('reporter-name') as HTMLInputElement).value;
        const reporterPhone = (document.getElementById('reporter-phone') as HTMLInputElement).value;
        const location = (document.getElementById('report-location') as HTMLTextAreaElement).value;

        try {
            await createReport({
                petId,
                reporterName,
                reporterPhone,
                location,
                message: location
            });
            
            showToast('¡Reporte enviado! El dueño será notificado.', 'success');
            modal?.classList.remove('active');
            (reportForm as HTMLFormElement).reset();
        } catch (error: any) {
            showToast(error.message || 'Error al enviar reporte', 'error');
        }
    });
}

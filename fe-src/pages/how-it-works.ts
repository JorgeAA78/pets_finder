import { renderHeader, initHeaderEvents } from '../components/header';

export function renderHowItWorksPage() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        ${renderHeader()}
        <div class="page how-it-works">
            <h1 class="page__title">¿Cómo funciona Pet Finder?</h1>
            
            <div class="steps">
                <div class="step">
                    <div class="step__number">1</div>
                    <div class="step__content">
                        <h3 class="step__title">Reportar mascotas perdidas</h3>
                        <p class="step__text">Si perdiste a tu mascota, podés crear un reporte con su foto y la ubicación donde la viste por última vez.</p>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step__number">2</div>
                    <div class="step__content">
                        <h3 class="step__title">Ver mascotas perdidas cerca de tu ubicación</h3>
                        <p class="step__text">Activá tu ubicación para ver todas las mascotas perdidas que fueron reportadas cerca de donde estás.</p>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step__number">3</div>
                    <div class="step__content">
                        <h3 class="step__title">Reportar avistamientos de mascotas</h3>
                        <p class="step__text">Si ves una mascota perdida, podés enviar un reporte al dueño con tu información de contacto y dónde la viste.</p>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step__number">4</div>
                    <div class="step__content">
                        <h3 class="step__title">Recibir notificaciones cuando alguien vea tu mascota</h3>
                        <p class="step__text">Cada vez que alguien reporte haber visto a tu mascota, recibirás un email con los datos del avistamiento.</p>
                    </div>
                </div>
            </div>
            
            <button class="btn btn--primary mt-20" id="back-btn">Volver al inicio</button>
        </div>
    `;

    initHeaderEvents();
    initHowItWorksEvents();
}

function initHowItWorksEvents() {
    const backBtn = document.getElementById('back-btn');
    backBtn?.addEventListener('click', () => {
        window.location.hash = '#/';
    });
}

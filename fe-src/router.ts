import { state, isAuthenticated } from './state';
import { renderHomePage } from './pages/home';
import { renderLoginPage, renderLoginPasswordPage } from './pages/login';
import { renderRegisterPage } from './pages/register';
import { renderPetsListPage } from './pages/pets-list';
import { renderReportPetPage } from './pages/report-pet';
import { renderEditPetPage } from './pages/edit-pet';
import { renderMyPetsPage } from './pages/my-pets';
import { renderProfilePage } from './pages/profile';
import { renderEditProfilePage } from './pages/edit-profile';
import { renderEditPasswordPage } from './pages/edit-password';
import { renderHowItWorksPage } from './pages/how-it-works';

type Route = {
    path: string;
    render: (params?: any) => void;
    requiresAuth?: boolean;
};

const routes: Route[] = [
    { path: '/', render: renderHomePage },
    { path: '/login', render: renderLoginPage },
    { path: '/login-password', render: renderLoginPasswordPage },
    { path: '/register', render: renderRegisterPage },
    { path: '/pets', render: renderPetsListPage },
    { path: '/report-pet', render: renderReportPetPage, requiresAuth: true },
    { path: '/edit-pet', render: renderEditPetPage, requiresAuth: true },
    { path: '/my-pets', render: renderMyPetsPage, requiresAuth: true },
    { path: '/profile', render: renderProfilePage, requiresAuth: true },
    { path: '/edit-profile', render: renderEditProfilePage, requiresAuth: true },
    { path: '/edit-password', render: renderEditPasswordPage, requiresAuth: true },
    { path: '/how-it-works', render: renderHowItWorksPage }
];

let currentParams: URLSearchParams = new URLSearchParams();

export function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}

function handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    currentParams = new URLSearchParams(queryString || '');
    
    const route = routes.find(r => r.path === path);
    
    if (!route) {
        navigateTo('/');
        return;
    }
    
    if (route.requiresAuth && !isAuthenticated()) {
        navigateTo('/login');
        return;
    }
    
    route.render(currentParams);
}

export function navigateTo(path: string) {
    window.location.hash = path;
}

export function getParams(): URLSearchParams {
    return currentParams;
}

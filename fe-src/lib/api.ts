const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

function getToken(): string | null {
    return localStorage.getItem('token');
}

function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Auth
export async function loginApi(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
    return data;
}

export async function registerApi(email: string, password: string, name?: string) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrarse');
    return data;
}

export async function fetchUserDataApi() {
    const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: getHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
}

export async function updateProfileApi(data: {
    name?: string;
    location?: string;
    lat?: number;
    lng?: number;
}) {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al actualizar perfil');
    return result;
}

export async function updatePasswordApi(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al actualizar contraseña');
    return result;
}

// Pets
export async function fetchAllPetsApi() {
    const res = await fetch(`${API_URL}/api/pets`);
    const data = await res.json();
    if (!res.ok) throw new Error('Error al cargar mascotas');
    return data;
}

export async function fetchNearbyPetsApi(lat: number, lng: number, radius: number = 10000) {
    const res = await fetch(`${API_URL}/api/pets/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    const data = await res.json();
    return data;
}

export async function fetchMyPetsApi() {
    const res = await fetch(`${API_URL}/api/pets/my-pets`, {
        headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error('Error al cargar tus mascotas');
    return data;
}

export async function createPetApi(petData: {
    name: string;
    characteristics?: string;
    description?: string;
    location: string;
    lat: number;
    lng: number;
    image?: string;
}) {
    const res = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(petData),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al reportar mascota');
    return result;
}

export async function updatePetApi(petId: number, petData: any) {
    const res = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(petData),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al actualizar mascota');
    return result;
}

export async function deletePetApi(petId: number) {
    const res = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al eliminar mascota');
    return result;
}

export async function markPetAsFoundApi(petId: number) {
    const res = await fetch(`${API_URL}/api/pets/${petId}/found`, {
        method: 'PUT',
        headers: getHeaders(),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al marcar como encontrada');
    return result;
}

// Reports
export async function createReportApi(reportData: {
    petId: number;
    reporterName: string;
    reporterPhone: string;
    location: string;
    message?: string;
}) {
    const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error al enviar reporte');
    return result;
}

// Mapbox
const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN || '';

export function getMapboxToken() {
    return MAPBOX_TOKEN;
}

export async function reverseGeocodeApi(lng: number, lat: number): Promise<string> {
    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=es`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].place_name;
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

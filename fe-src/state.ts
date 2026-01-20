const API_URL = '';

interface User {
    id: number;
    name: string;
    email: string;
    location: string;
    lat: number | null;
    lng: number | null;
}

interface Pet {
    id: number;
    name: string;
    status: 'lost' | 'found';
    location: string;
    lat: number;
    lng: number;
    imageUrl: string;
    userId: number;
    owner?: { id: number; name: string };
}

interface AppState {
    user: User | null;
    token: string | null;
    pets: Pet[];
    myPets: Pet[];
    currentLocation: { lat: number; lng: number } | null;
}

export const state: AppState = {
    user: null,
    token: null,
    pets: [],
    myPets: [],
    currentLocation: null
};

export async function initState() {
    const token = localStorage.getItem('token');
    if (token) {
        state.token = token;
        await fetchUserData();
    }
}

function getHeaders() {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }
    return headers;
}

export async function fetchUserData() {
    try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            headers: getHeaders()
        });
        if (res.ok) {
            state.user = await res.json();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}

export async function login(email: string, password: string) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
    }
    
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    
    return data;
}

export async function register(email: string, password: string, name?: string) {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.error || 'Error al registrarse');
    }
    
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem('token', data.token);
    
    return data;
}

export function logout() {
    state.token = null;
    state.user = null;
    state.myPets = [];
    localStorage.removeItem('token');
}

export async function updateProfile(data: { name?: string; location?: string; lat?: number; lng?: number }) {
    const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al actualizar perfil');
    }
    
    state.user = result.user;
    return result;
}

export async function updatePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_URL}/api/auth/password`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al actualizar contraseña');
    }
    
    return result;
}

export async function fetchNearbyPets(lat: number, lng: number, radius: number = 10000) {
    const res = await fetch(`${API_URL}/api/pets/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    const data = await res.json();
    
    if (res.ok) {
        state.pets = data;
    }
    
    return data;
}

export async function fetchAllPets() {
    const res = await fetch(`${API_URL}/api/pets`);
    const data = await res.json();
    
    if (res.ok) {
        state.pets = data;
    }
    
    return data;
}

export async function fetchMyPets() {
    const res = await fetch(`${API_URL}/api/pets/my-pets`, {
        headers: getHeaders()
    });
    const data = await res.json();
    
    if (res.ok) {
        state.myPets = data;
    }
    
    return data;
}

export async function createPet(petData: { name: string; characteristics?: string; description?: string; location: string; lat: number; lng: number; image?: string }) {
    const res = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(petData)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al reportar mascota');
    }
    
    return result;
}

export async function updatePet(petId: number, petData: any) {
    const res = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(petData)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al actualizar mascota');
    }
    
    return result;
}

export async function deletePet(petId: number) {
    const res = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al eliminar mascota');
    }
    
    return result;
}

export async function markPetAsFound(petId: number) {
    const res = await fetch(`${API_URL}/api/pets/${petId}/found`, {
        method: 'PUT',
        headers: getHeaders()
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al marcar como encontrada');
    }
    
    return result;
}

export async function createReport(reportData: { petId: number; reporterName: string; reporterPhone: string; location: string; message?: string }) {
    const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
    });
    
    const result = await res.json();
    
    if (!res.ok) {
        throw new Error(result.error || 'Error al enviar reporte');
    }
    
    return result;
}

export function setCurrentLocation(lat: number, lng: number) {
    state.currentLocation = { lat, lng };
}

export function isAuthenticated(): boolean {
    return !!state.token && !!state.user;
}

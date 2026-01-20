import algoliasearch from 'algoliasearch';

const hasAlgoliaConfig = process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY;

console.log('🔍 Algolia config:', {
    hasConfig: hasAlgoliaConfig,
    appId: process.env.ALGOLIA_APP_ID ? '✅ configurado' : '❌ falta',
    apiKey: process.env.ALGOLIA_API_KEY ? '✅ configurado' : '❌ falta'
});

const client = hasAlgoliaConfig 
    ? algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_API_KEY!)
    : null;

export const petsIndex = client ? client.initIndex('pets') : null;

export async function indexPet(pet: {
    id: number;
    name: string;
    location: string;
    lat: number;
    lng: number;
    imageUrl?: string;
    status: string;
}) {
    if (!petsIndex) {
        console.log('🔍 [DEV] Algolia no configurado - indexPet:', pet.name);
        return;
    }
    try {
        console.log('🔍 Indexando mascota en Algolia:', pet.name);
        await petsIndex.saveObject({
            objectID: pet.id.toString(),
            name: pet.name,
            location: pet.location,
            status: pet.status,
            imageUrl: pet.imageUrl,
            _geoloc: {
                lat: pet.lat,
                lng: pet.lng
            }
        });
        console.log('✅ Mascota indexada en Algolia:', pet.name);
    } catch (error) {
        console.error('❌ Error indexando en Algolia:', error);
    }
}

export async function searchPetsNearby(lat: number, lng: number, radiusInMeters: number = 10000) {
    if (!petsIndex) {
        console.log('🔍 [DEV] Algolia no configurado - búsqueda local');
        return [];
    }
    const results = await petsIndex.search('', {
        aroundLatLng: `${lat}, ${lng}`,
        aroundRadius: radiusInMeters,
        filters: 'status:lost'
    });
    return results.hits;
}

export async function deletePetFromIndex(petId: number) {
    if (!petsIndex) {
        console.log('🔍 [DEV] Algolia no configurado - deletePet:', petId);
        return;
    }
    await petsIndex.deleteObject(petId.toString());
}

export async function updatePetInIndex(pet: {
    id: number;
    name: string;
    location: string;
    lat: number;
    lng: number;
    imageUrl?: string;
    status: string;
}) {
    await indexPet(pet);
}

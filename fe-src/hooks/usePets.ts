import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';
import {
    fetchAllPetsApi,
    fetchNearbyPetsApi,
    fetchMyPetsApi,
    createPetApi,
    updatePetApi,
    deletePetApi,
    markPetAsFoundApi,
    createReportApi,
} from '../lib/api';

export interface Pet {
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

export const petsAtom = atom<Pet[]>({
    key: 'petsAtom',
    default: [],
});

export const myPetsAtom = atom<Pet[]>({
    key: 'myPetsAtom',
    default: [],
});

export function usePets() {
    const [pets, setPets] = useRecoilState(petsAtom);
    const [myPets, setMyPets] = useRecoilState(myPetsAtom);

    const fetchAllPets = useCallback(async () => {
        const data = await fetchAllPetsApi();
        setPets(data);
        return data;
    }, [setPets]);

    const fetchNearbyPets = useCallback(
        async (lat: number, lng: number, radius?: number) => {
            const data = await fetchNearbyPetsApi(lat, lng, radius);
            setPets(data);
            return data;
        },
        [setPets]
    );

    const fetchMyPets = useCallback(async () => {
        const data = await fetchMyPetsApi();
        setMyPets(data);
        return data;
    }, [setMyPets]);

    const createPet = useCallback(
        async (petData: {
            name: string;
            characteristics?: string;
            description?: string;
            location: string;
            lat: number;
            lng: number;
            image?: string;
        }) => {
            return await createPetApi(petData);
        },
        []
    );

    const updatePet = useCallback(async (petId: number, petData: any) => {
        return await updatePetApi(petId, petData);
    }, []);

    const deletePet = useCallback(async (petId: number) => {
        return await deletePetApi(petId);
    }, []);

    const markPetAsFound = useCallback(async (petId: number) => {
        return await markPetAsFoundApi(petId);
    }, []);

    const createReport = useCallback(
        async (reportData: {
            petId: number;
            reporterName: string;
            reporterPhone: string;
            location: string;
            message?: string;
        }) => {
            return await createReportApi(reportData);
        },
        []
    );

    return {
        pets,
        myPets,
        fetchAllPets,
        fetchNearbyPets,
        fetchMyPets,
        createPet,
        updatePet,
        deletePet,
        markPetAsFound,
        createReport,
    };
}

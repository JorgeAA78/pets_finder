import { atom, useRecoilState } from 'recoil';
import { useCallback } from 'react';

interface LocationState {
    lat: number;
    lng: number;
}

export const currentLocationAtom = atom<LocationState | null>({
    key: 'currentLocationAtom',
    default: null,
});

export function useLocation() {
    const [currentLocation, setCurrentLocation] = useRecoilState(currentLocationAtom);

    const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            });
        });
    }, []);

    const requestLocation = useCallback(async () => {
        const position = await getCurrentPosition();
        const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
        setCurrentLocation(loc);
        return loc;
    }, [getCurrentPosition, setCurrentLocation]);

    return {
        currentLocation,
        setCurrentLocation,
        requestLocation,
    };
}

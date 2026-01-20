declare const mapboxgl: any;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ3VsYWljbzE5NzgiLCJhIjoiY21razlkMHdsMWRvbDNlcHMxOG1xaXVkbiJ9.Ko8drNiqWAow7sKD36M8xQ';

let mapInstance: any = null;
let marker: any = null;

export function initMap(containerId: string, center: [number, number] = [-58.3816, -34.6037], zoom: number = 12): any {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    mapInstance = new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
    });

    mapInstance.addControl(new mapboxgl.NavigationControl());

    return mapInstance;
}

export function addMarker(lng: number, lat: number, draggable: boolean = false): any {
    if (marker) {
        marker.remove();
    }
    
    marker = new mapboxgl.Marker({ draggable })
        .setLngLat([lng, lat])
        .addTo(mapInstance);
    
    return marker;
}

export function getMarkerPosition(): { lng: number; lat: number } | null {
    if (!marker) return null;
    const lngLat = marker.getLngLat();
    return { lng: lngLat.lng, lat: lngLat.lat };
}

export function onMapClick(callback: (lng: number, lat: number) => void) {
    mapInstance?.on('click', (e: any) => {
        callback(e.lngLat.lng, e.lngLat.lat);
    });
}

export function onMarkerDragEnd(callback: (lng: number, lat: number) => void) {
    marker?.on('dragend', () => {
        const lngLat = marker.getLngLat();
        callback(lngLat.lng, lngLat.lat);
    });
}

export function setMapCenter(lng: number, lat: number) {
    mapInstance?.flyTo({ center: [lng, lat], zoom: 14 });
}

export function destroyMap() {
    if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
    }
    marker = null;
}

export async function reverseGeocode(lng: number, lat: number): Promise<string> {
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

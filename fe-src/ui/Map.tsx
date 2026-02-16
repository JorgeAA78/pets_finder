import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { getMapboxToken, reverseGeocodeApi } from '../lib/api';

interface MapProps {
    center?: [number, number];
    zoom?: number;
    markerPosition?: { lng: number; lat: number } | null;
    draggable?: boolean;
    onClick?: (lng: number, lat: number) => void;
    onMarkerDragEnd?: (lng: number, lat: number) => void;
}

export function MapComponent({
    center = [-58.3816, -34.6037],
    zoom = 12,
    markerPosition,
    draggable = false,
    onClick,
    onMarkerDragEnd,
}: MapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        mapboxgl.accessToken = getMapboxToken();

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: center,
            zoom: zoom,
        });

        map.addControl(new mapboxgl.NavigationControl());
        mapRef.current = map;

        if (onClick) {
            map.on('click', (e: mapboxgl.MapMouseEvent) => {
                onClick(e.lngLat.lng, e.lngLat.lat);
            });
        }

        return () => {
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markerPosition) return;

        if (markerRef.current) {
            markerRef.current.remove();
        }

        const marker = new mapboxgl.Marker({ draggable })
            .setLngLat([markerPosition.lng, markerPosition.lat])
            .addTo(mapRef.current);

        if (draggable && onMarkerDragEnd) {
            marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                onMarkerDragEnd(lngLat.lng, lngLat.lat);
            });
        }

        markerRef.current = marker;
    }, [markerPosition, draggable, onMarkerDragEnd]);

    return (
        <div className="map-container">
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}

export { reverseGeocodeApi as reverseGeocode };

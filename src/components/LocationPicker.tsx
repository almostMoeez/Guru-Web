import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../lib/googleMaps';
import { reverseGeocode, type GeoAddress } from '../lib/geocode';
import { LAHORE_BOUNDS, LAHORE_CENTER } from '../lib/lahoreAreas';

// Muted dark styling so the map blends with the dark modals it lives in.
const DARK_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#383838' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4a4a4a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

interface LocationPickerProps {
  /** When set/changed, recenters the map + marker (area choice, "use my location"). */
  center: [number, number] | null;
  /** Fired whenever the pin moves, with the resolved address. */
  onPick: (geo: GeoAddress, coords: [number, number]) => void;
}

export default function LocationPicker({ center, onPick }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [loadError, setLoadError] = useState(false);
  // Keep latest onPick without re-initializing the map.
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  const resolvePin = (lat: number, lng: number) => {
    reverseGeocode(lat, lng)
      .then((geo) => onPickRef.current(geo, [lat, lng]))
      .catch(() => {});
  };

  // Initialize the map once.
  useEffect(() => {
    let cancelled = false;

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const start = center ? { lat: center[0], lng: center[1] } : LAHORE_CENTER;

        const map = new maps.Map(containerRef.current, {
          center: start,
          zoom: 13,
          restriction: { latLngBounds: LAHORE_BOUNDS, strictBounds: false },
          styles: DARK_MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          clickableIcons: false,
        });

        const marker = new maps.Marker({ map, position: start, draggable: true });

        marker.addListener('dragend', () => {
          const pos = marker.getPosition();
          if (pos) resolvePin(pos.lat(), pos.lng());
        });
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          marker.setPosition(e.latLng);
          resolvePin(e.latLng.lat(), e.latLng.lng());
        });

        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      markerRef.current?.setMap(null);
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when the parent provides a new center (area choice, geolocation).
  useEffect(() => {
    if (!center || !mapRef.current || !markerRef.current) return;
    const pos = { lat: center[0], lng: center[1] };
    mapRef.current.panTo(pos);
    mapRef.current.setZoom(15);
    markerRef.current.setPosition(pos);
    resolvePin(center[0], center[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);

  if (loadError) {
    return (
      <div className="w-full h-44 sm:h-56 rounded-2xl border border-white/10 bg-zinc-950 flex items-center justify-center px-6 text-center text-zinc-500 text-xs">
        The map could not be loaded. Pick your area and type the address below.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-white/10"
    />
  );
}

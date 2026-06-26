import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { reverseGeocode, type GeoAddress } from '../lib/geocode';

// Bundlers don't resolve Leaflet's default marker images automatically — set them.
const markerIconObj = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Lahore city centre as a sensible default.
const DEFAULT_CENTER: [number, number] = [31.5204, 74.3487];

interface LocationPickerProps {
  /** When set/changed, recenters the map + marker (e.g. after "use my location"). */
  center: [number, number] | null;
  /** Fired whenever the pin moves, with the resolved address. */
  onPick: (geo: GeoAddress, coords: [number, number]) => void;
}

export default function LocationPicker({ center, onPick }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  // Keep latest onPick without re-initializing the map.
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  // Initialize the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const start = center ?? DEFAULT_CENTER;

    const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(start, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker(start, { draggable: true, icon: markerIconObj }).addTo(map);

    const resolve = (latlng: L.LatLng) => {
      reverseGeocode(latlng.lat, latlng.lng)
        .then((geo) => onPickRef.current(geo, [latlng.lat, latlng.lng]))
        .catch(() => {});
    };
    marker.on('dragend', () => resolve(marker.getLatLng()));
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      resolve(e.latlng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Modal/drawer animations leave the container at the wrong size on init.
    const t = window.setTimeout(() => map.invalidateSize(), 250);

    return () => {
      window.clearTimeout(t);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when the parent provides a new center.
  useEffect(() => {
    if (!center || !mapRef.current || !markerRef.current) return;
    mapRef.current.setView(center, 16);
    markerRef.current.setLatLng(center);
    reverseGeocode(center[0], center[1])
      .then((geo) => onPickRef.current(geo, center))
      .catch(() => {});
  }, [center]);

  return (
    <div
      ref={containerRef}
      className="w-full h-56 rounded-2xl overflow-hidden border border-white/10"
    />
  );
}

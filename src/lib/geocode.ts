// Lightweight geolocation + reverse-geocoding so users can fill an address
// from their current location. Uses the browser Geolocation API and the free
// OpenStreetMap Nominatim service (no API key required).

export interface GeoAddress {
  addressLine1: string;
  landmark?: string;
  city?: string;
  postalCode?: string;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  postcode?: string;
}

/** Reverse-geocode coordinates into a structured address. */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoAddress> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Could not look up your address. Please enter it manually.');

  const data = (await res.json()) as { address?: NominatimAddress; display_name?: string };
  const a = data.address ?? {};
  const line1 = [a.house_number, a.road].filter(Boolean).join(' ');

  return {
    addressLine1: line1 || a.neighbourhood || a.suburb || data.display_name?.split(',')[0] || '',
    landmark: a.neighbourhood || a.suburb || a.quarter || undefined,
    city: a.city || a.town || a.village || a.county || undefined,
    postalCode: a.postcode || undefined,
  };
}

/** Get the user's current coordinates (for centering a map). */
export function getCurrentCoords(): Promise<[number, number]> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Location is not supported on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      (err) => {
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? 'Location permission denied. Please allow access or pick on the map.'
              : 'Could not get your location. Please pick on the map.',
          ),
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

/** Get the user's current position and resolve it to an address. */
export function getCurrentLocationAddress(): Promise<GeoAddress> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Location is not supported on this device.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        reverseGeocode(pos.coords.latitude, pos.coords.longitude).then(resolve, reject);
      },
      (err) => {
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? 'Location permission denied. Please allow access or enter the address manually.'
              : 'Could not get your location. Please enter the address manually.',
          ),
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

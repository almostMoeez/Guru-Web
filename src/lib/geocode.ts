// Geolocation + reverse-geocoding so users can fill an address from a map pin
// or their current location. Uses the browser Geolocation API and the Google
// Geocoding service (via the Maps JavaScript API).

import { loadGoogleMaps } from './googleMaps';

export interface GeoAddress {
  addressLine1: string;
  landmark?: string;
  city?: string;
  postalCode?: string;
}

/** First matching address component across the geocoder results, in order. */
function findComponent(
  results: google.maps.GeocoderResult[],
  type: string,
): string | undefined {
  for (const result of results) {
    const match = result.address_components.find((c) => c.types.includes(type));
    if (match) return match.long_name;
  }
  return undefined;
}

/** Reverse-geocode coordinates into a structured address. */
export async function reverseGeocode(lat: number, lon: number): Promise<GeoAddress> {
  const maps = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();

  let results: google.maps.GeocoderResult[];
  try {
    ({ results } = await geocoder.geocode({ location: { lat, lng: lon } }));
  } catch {
    throw new Error('Could not look up your address. Please enter it manually.');
  }
  if (!results.length) {
    throw new Error('Could not look up your address. Please enter it manually.');
  }

  // Lahore results often carry the house number as `premise` instead of
  // `street_number`, and the block as `neighborhood` / `sublocality_level_2`.
  const houseNumber =
    findComponent(results, 'street_number') ?? findComponent(results, 'premise');
  const route = findComponent(results, 'route');
  const block =
    findComponent(results, 'neighborhood') ?? findComponent(results, 'sublocality_level_2');
  const area = findComponent(results, 'sublocality_level_1');
  const line1 = [houseNumber, route ?? block].filter(Boolean).join(' ');
  const landmark = [block, area].filter((v, i, arr) => v && arr.indexOf(v) === i).join(', ');

  return {
    addressLine1: line1 || area || results[0].formatted_address.split(',')[0] || '',
    landmark: landmark || undefined,
    city: findComponent(results, 'locality') ?? 'Lahore',
    postalCode: findComponent(results, 'postal_code'),
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

// Singleton loader for the Google Maps JavaScript API. The script is injected
// once and every caller awaits the same promise.

let loadPromise: Promise<typeof google.maps> | null = null;

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve(google.maps);
      return;
    }

    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) {
      reject(new Error('Google Maps API key is not configured.'));
      return;
    }

    const callbackName = '__onGoogleMapsLoaded';
    (window as unknown as Record<string, unknown>)[callbackName] = () => {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      resolve(google.maps);
    };

    const script = document.createElement('script');
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${key}` +
      `&loading=async&callback=${callbackName}&region=PK&language=en`;
    script.async = true;
    script.onerror = () => {
      loadPromise = null;
      reject(new Error('Could not load Google Maps.'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

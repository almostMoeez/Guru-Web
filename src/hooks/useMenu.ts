import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMenu } from '../lib/api/menu';
import { ApiError } from '../lib/api/client';
import { mapMenu } from '../lib/mappers';
import type { MenuCategoryGroup } from '../types';

// How long to wait before showing the "still loading" hint.
const SLOW_HINT_DELAY_MS = 4_000;
// How long to wait before auto-retrying a network failure (Render cold start).
const AUTO_RETRY_DELAY_MS = 8_000;

interface UseMenuResult {
  groups: MenuCategoryGroup[];
  loading: boolean;
  /** Non-null when loading, indicates the server may be warming up. */
  loadingHint: string | null;
  error: string | null;
  reload: () => void;
}

/** Loads the menu from the backend, with one automatic retry on network failure. */
export function useMenu(): UseMenuResult {
  const [groups, setGroups] = useState<MenuCategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHint, setLoadingHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  // Tracks whether this nonce has already triggered an auto-retry so we don't
  // loop infinitely. Stored in a ref so it doesn't cause re-renders.
  const retriedForNonce = useRef<number>(-1);

  const reload = useCallback(() => {
    retriedForNonce.current = -1; // allow a fresh auto-retry on manual reload
    setNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let slowTimer: ReturnType<typeof setTimeout>;
    let retryTimer: ReturnType<typeof setTimeout>;

    setLoading(true);
    setError(null);
    setLoadingHint(null);

    // Show a hint if loading takes longer than expected.
    slowTimer = setTimeout(() => {
      setLoadingHint('Still connecting — the server may be starting up…');
    }, SLOW_HINT_DELAY_MS);

    fetchMenu(controller.signal)
      .then((apiGroups) => {
        setGroups(mapMenu(apiGroups));
        setLoading(false);
        setLoadingHint(null);
      })
      .catch((err: ApiError | Error) => {
        if (controller.signal.aborted) return;

        const isNetworkError = err instanceof ApiError && err.status === 0;
        const alreadyRetried = retriedForNonce.current === nonce;

        if (isNetworkError && !alreadyRetried) {
          // Auto-retry once: keep loading=true and show a descriptive hint.
          retriedForNonce.current = nonce;
          setLoadingHint(
            'Server is waking up — retrying automatically in a moment…',
          );
          retryTimer = setTimeout(() => {
            if (!controller.signal.aborted) {
              setNonce((n) => n + 1);
            }
          }, AUTO_RETRY_DELAY_MS);
        } else {
          setError(err?.message ?? 'Failed to load the menu.');
          setLoading(false);
          setLoadingHint(null);
        }
      });

    return () => {
      controller.abort();
      clearTimeout(slowTimer);
      clearTimeout(retryTimer);
    };
  }, [nonce]);

  return { groups, loading, loadingHint, error, reload };
}

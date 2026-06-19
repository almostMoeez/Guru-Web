import { useCallback, useEffect, useState } from 'react';
import { fetchAddresses } from '../lib/api/users';
import type { ApiUserAddress } from '../lib/api/types';

interface UseAddressesResult {
  addresses: ApiUserAddress[];
  loading: boolean;
  reload: () => void;
}

/** Loads the signed-in user's saved delivery addresses. */
export function useAddresses(enabled: boolean): UseAddressesResult {
  const [addresses, setAddresses] = useState<ApiUserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setAddresses([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchAddresses()
      .then((list) => {
        if (!cancelled) setAddresses(list);
      })
      .catch(() => {
        if (!cancelled) setAddresses([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, nonce]);

  return { addresses, loading, reload };
}

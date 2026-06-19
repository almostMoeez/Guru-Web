import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AUTH_TOKEN_KEY } from '../config';
import { fetchProfile } from '../api/users';
import type { ApiUser } from '../api/types';

interface AuthContextValue {
  token: string | null;
  user: ApiUser | null;
  isAuthenticated: boolean;
  /** Persist a freshly issued JWT and load the user's profile. */
  login: (token: string) => void;
  logout: () => void;
  /** Re-fetch the profile from the backend (e.g. after a profile update). */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<ApiUser | null>(null);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const login = useCallback((newToken: string) => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    } catch {
      /* ignore storage errors */
    }
    setToken(newToken);
  }, []);

  // Load (or refresh) the profile whenever the token changes. A 401 means the
  // token is stale/invalid, so we clear it.
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    let cancelled = false;
    fetchProfile()
      .then((profile) => {
        if (!cancelled) setUser(profile);
      })
      .catch(() => {
        if (!cancelled) logout();
      });
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await fetchProfile();
      setUser(profile);
    } catch {
      /* keep the existing user on a transient failure */
    }
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refreshProfile,
    }),
    [token, user, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

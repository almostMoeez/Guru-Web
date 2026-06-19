// Central runtime configuration sourced from Vite env vars.
// Backend (NestJS) defaults to port 3000, but the frontend dev server also uses
// 3000 — run the backend on 4000 (set PORT=4000 in the backend .env) to avoid a clash.

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000').trim();

// Tolerate a base URL without a scheme (e.g. "localhost:4000"): without
// "http(s)://" the browser treats it as an invalid protocol and fetch throws.
const withScheme =
  /^https?:\/\//i.test(rawBaseUrl) || rawBaseUrl.startsWith('/')
    ? rawBaseUrl
    : `http://${rawBaseUrl}`;

export const API_BASE_URL: string = withScheme.replace(/\/+$/, ''); // strip trailing slash

// Orders require a branch. The seeded backend uses bigint ids; default to "1".
export const DEFAULT_BRANCH_ID: string =
  import.meta.env.VITE_DEFAULT_BRANCH_ID ?? '1';

// localStorage key for the persisted JWT access token.
export const AUTH_TOKEN_KEY = 'guru.auth.token';

// localStorage key for the user's selected branch.
export const BRANCH_STORAGE_KEY = 'guru.branch.id';

export interface BranchOption {
  /** Must match the backend `branches.id` for orders to succeed. */
  id: string;
  name: string;
  area: string;
}

// The selectable branches. `id` must correspond to a row in the backend
// `branches` table — Wapda Town is the seeded branch (id 1); Model Town (id 2)
// must be inserted in the DB for orders to it to go through.
export const BRANCHES: BranchOption[] = [
  { id: '1', name: 'Wapda Town', area: 'Lahore' },
  { id: '2', name: 'Model Town', area: 'Lahore' },
];

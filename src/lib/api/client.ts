import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config';

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const readToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Attach the stored bearer token (required for protected endpoints). */
  auth?: boolean;
  signal?: AbortSignal;
}

/**
 * Thin fetch wrapper: JSON in/out, optional bearer auth, normalized errors.
 * Throws ApiError on non-2xx so callers can branch on `.status`.
 * status === 0 means a network-level failure (unreachable host, no internet, etc.)
 */
export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options;

  const headers: Record<string, string> = {
    // Bypass the ngrok free-tier browser-warning interstitial (ERR_NGROK_6024),
    // which is served as HTML without CORS headers. Harmless on non-ngrok hosts.
    'ngrok-skip-browser-warning': 'true',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = readToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    // Network-level failure: DNS, refused connection, offline, or the server
    // host is sleeping (e.g. Render free-tier cold start).
    throw new ApiError(
      0,
      'Cannot connect to the server. The service may be waking up — please wait a moment and try again.',
    );
  }

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (payload && (payload.message || payload.error)) ||
      response.statusText ||
      'Request failed';
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message.join(', ') : String(message),
      payload,
    );
  }

  return payload as T;
}

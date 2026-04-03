function backendBase(): string {
  return (
    process.env.API_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3001'
  ).replace(/\/$/, '');
}

/**
 * Browser: same-origin `/api/...` (proxied via next.config rewrites → backend).
 * Server: direct URL to the backend (works during `next build` without a running Next server).
 */
export function getApiUrl(path: string): string {
  const segment = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    return segment;
  }
  return `${backendBase()}${segment}`;
}

export function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('icoltex_token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
): Promise<T> {
  const { body, ...rest } = options;
  const url = getApiUrl(path);
  const fetchBody = body !== undefined ? JSON.stringify(body) : undefined;
  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
      ...(rest.headers as Record<string, string>),
    },
    body: fetchBody,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || data?.message || `Error ${res.status}`);
  }
  return data as T;
}

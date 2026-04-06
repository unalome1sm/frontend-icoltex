function backendBase(): string {
  return (
    process.env.API_URL ||
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3001'
  ).replace(/\/$/, '');
}

/** Base pública del API (Vercel / prod): debe ser HTTPS sin barra final. */
function publicApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() ?? '';
  return raw.replace(/\/$/, '');
}

/**
 * - Navegador: si existe `NEXT_PUBLIC_API_URL`, llama al backend directo (CORS en el servidor).
 *   Si no, usa `/api/...` mismo origen (rewrite en `next.config` → backend).
 * - Servidor (RSC, build): URL directa con `API_URL` / `BACKEND_URL` / `NEXT_PUBLIC_API_URL`.
 */
export function getApiUrl(path: string): string {
  const segment = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    const base = publicApiBase();
    if (base && /^https?:\/\//i.test(base)) {
      return `${base}${segment}`;
    }
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

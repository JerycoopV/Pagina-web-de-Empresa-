const apiUrl = import.meta.env.PUBLIC_API_URL;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('capitalFest_token');
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${apiUrl}${path}`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('capitalFest_token');
    localStorage.removeItem('capitalFest_user');
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    throw new Error('Sesión expirada');
  }

  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.status === 204 ? (undefined as T) : response.json();
}

export function requireSession() {
  if (!localStorage.getItem('capitalFest_token')) {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }
  return true;
}

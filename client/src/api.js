const BASE = import.meta.env.VITE_API_URL || '/api';
export const FILE_BASE = import.meta.env.VITE_FILE_URL || '';
export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const t = localStorage.getItem('token');
  if (t) headers.Authorization = 'Bearer ' + t;
  if (body) headers['Content-Type'] = 'application/json';
  const r = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.message || 'Request failed');
  return d;
}

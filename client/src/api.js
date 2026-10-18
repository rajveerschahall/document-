import { mockApi } from './mockApi.js';

const BASE = import.meta.env.VITE_API_URL || '/api';
export const FILE_BASE = import.meta.env.VITE_FILE_URL || '';

// Detect if running on GitHub Pages (static site hosting where backend does not exist)
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

export async function api(path, { method = 'GET', body, form } = {}) {
  // If hosted on GitHub Pages or static environment:
  if (isGitHubPages || (typeof window !== 'undefined' && window.USE_MOCK_DEMO)) {
    return await mockApi(path, { method, body, form });
  }

  // Attempt real backend call
  try {
    const headers = {};
    const t = localStorage.getItem('token');
    if (t) headers.Authorization = 'Bearer ' + t;
    if (body) headers['Content-Type'] = 'application/json';
    const r = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      // If 404 on static preview, fallback to mock demo
      if (r.status === 404 || r.status === 502 || r.status === 503) {
        return await mockApi(path, { method, body, form });
      }
      throw new Error(d.message || 'Request failed');
    }
    return d;
  } catch (err) {
    // If backend server is not reachable locally (Failed to fetch)
    if (
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('Network') ||
      err.message?.includes('Failed')
    ) {
      console.warn(`[AdmissionVerify] Backend offline at ${BASE + path}. Seamlessly using interactive demo database.`);
      return await mockApi(path, { method, body, form });
    }
    throw err;
  }
}


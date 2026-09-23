const TOKEN_KEY = 'districarnes_session';

export function hasSession() {
  return Boolean(sessionStorage.getItem(TOKEN_KEY));
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const headers = { Accept: 'application/json' };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && token) {
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.replace('/');
  }

  if (!response.ok) {
    throw new Error(data.message || 'No fue posible completar la solicitud');
  }

  return data;
}

export async function startSession(email, password) {
  const session = await apiRequest('/login', {
    method: 'POST',
    body: { email, password }
  });
  sessionStorage.setItem(TOKEN_KEY, session.token);
}

export async function closeSession() {
  try {
    await apiRequest('/logout', { method: 'POST' });
  } finally {
    sessionStorage.removeItem(TOKEN_KEY);
    window.location.replace('/');
  }
}

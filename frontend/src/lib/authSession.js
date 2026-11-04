// Single source of truth for the persisted auth session, shared by the auth
// store (React side) and the api layer (which must stay dependency-free).
export const AUTH_KEY = "frameora:auth";

export function readSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupt / unavailable -> treat as signed out */
  }
  return null;
}

export function writeSession(user) {
  try {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* storage disabled -> session lives in memory only this tab */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    /* noop */
  }
}

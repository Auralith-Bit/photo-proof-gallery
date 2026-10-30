// In-memory + persisted album password store (mock). Never exposed to the UI as a
// value the page can read back; the frontend only ever learns hasPassword().
// A real backend stores a hash and verifies server-side.

const KEY = "frameora:v2:secrets";

function hydrate() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return new Map(Object.entries(JSON.parse(raw)));
  } catch {
    /* ignore */
  }
  return new Map();
}

const albumPasswords = hydrate();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(albumPasswords)));
  } catch {
    /* ignore */
  }
}

export function hasPassword(albumId) {
  return albumPasswords.has(albumId);
}
export function setPassword(albumId, password) {
  albumPasswords.set(albumId, password);
  persist();
}
export function removePassword(albumId) {
  albumPasswords.delete(albumId);
  persist();
}
export function checkPassword(albumId, password) {
  if (!albumPasswords.has(albumId)) return true; // no password set => open
  return albumPasswords.get(albumId) === password;
}
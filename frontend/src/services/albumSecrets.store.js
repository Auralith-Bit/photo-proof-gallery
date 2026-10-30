// In-memory album password store (mock). Never persisted, never exposed to the UI.
// A real backend stores a hash and verifies server-side; the frontend only ever
// learns whether a password EXISTS, never its value.
const albumPasswords = new Map();

export function hasPassword(albumId) {
  return albumPasswords.has(albumId);
}
export function setPassword(albumId, password) {
  albumPasswords.set(albumId, password);
}
export function removePassword(albumId) {
  albumPasswords.delete(albumId);
}
export function checkPassword(albumId, password) {
  if (!albumPasswords.has(albumId)) return true; // no password set => open
  return albumPasswords.get(albumId) === password;
}
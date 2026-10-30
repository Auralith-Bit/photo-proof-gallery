// Live, persisted mock collections. Seeds come from the *.mock.js files; once the
// app has run, user-created albums/photos/clients are stored in localStorage (v2 keys)
// so they survive dev-server restarts and page reloads. Services mutate these live
// references and call the matching save*() afterwards.

import { mockAlbums } from "./albums.mock";
import { mockPhotos } from "./photos.mock";
import { mockClients } from "./clients.mock";

const KEYS = {
  albums: "frameora:v2:albums",
  photos: "frameora:v2:photos",
  clients: "frameora:v2:clients",
};

function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupt or unavailable -> fall back to seed */
  }
  return seed;
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // QuotaExceeded (large data-URL photos) or storage disabled: keep the in-memory
    // copy authoritative for this session and warn in dev. Real persistence is the
    // backend's job (see README §5 multipart upload contract).
    if (typeof console !== "undefined" && import.meta.env?.DEV) {
      console.warn(`[frameora] could not persist ${key}; changes stay in-memory this session.`, e);
    }
  }
}

export const albums = load(KEYS.albums, mockAlbums);
export const photos = load(KEYS.photos, mockPhotos); // object map: albumId -> Photo[]
export const clients = load(KEYS.clients, mockClients);

export function saveAlbums() {
  write(KEYS.albums, albums);
}
export function savePhotos() {
  write(KEYS.photos, photos);
}
export function saveClients() {
  write(KEYS.clients, clients);
}
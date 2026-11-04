import { api } from "../lib/api";

export async function getAlbums() {
  return await api.get("/albums");
}

export async function getAlbumById(albumId) {
  return await api.get(`/albums/${albumId}`);
}

export async function createAlbum(data) {
  return await api.post("/albums", data);
}

export async function updateAlbum(albumId, data) {
  return await api.patch(`/albums/${albumId}`, data);
}

export async function archiveAlbum(albumId) {
  return await api.post(`/albums/${albumId}/archive`);
}

export async function draftAlbum(albumId) {
  return await api.post(`/albums/${albumId}/draft`);
}

export async function restoreAlbum(albumId) {
  return await api.post(`/albums/${albumId}/restore`);
}

export async function deleteAlbum(albumId) {
  return await api.delete(`/albums/${albumId}`);
}

/* ---------- Privacy mutations ---------- */

export async function setAccessEnabled(albumId, enabled) {
  return await api.patch(`/albums/${albumId}/access`, { enabled });
}

export async function setDownloadPermission(albumId, allow) {
  return await api.patch(`/albums/${albumId}/downloads`, { allow });
}

export async function setAlbumPassword(albumId, password) {
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  return await api.put(`/albums/${albumId}/password`, { password });
}

export async function removeAlbumPassword(albumId) {
  return await api.delete(`/albums/${albumId}/password`);
}

export async function regenerateAlbumLink(albumId) {
  return await api.post(`/albums/${albumId}/regenerate-link`);
}

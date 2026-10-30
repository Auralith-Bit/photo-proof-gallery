import { mockAlbums } from "../mocks/albums.mock";
import { mockPhotos } from "../mocks/photos.mock";
import { mockClients } from "../mocks/clients.mock";
import { getPreferencesSync } from "./settings.service";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock-only password store. A real backend would store a hash and never return it.
const albumPasswords = new Map();
albumPasswords.set("alb_01", "frameora");

function withPrivacy(album) {
  return {
    ...album,
    clientName: mockClients.find((c) => c.id === album.clientId)?.fullName || null,
    hasPassword: albumPasswords.has(album.id),
  };
}

function findAlbum(albumId) {
  const album = mockAlbums.find((a) => a.id === albumId);
  if (!album) throw new Error("Album not found");
  return album;
}

export async function getAlbums() {
  await delay();
  return mockAlbums.map(withPrivacy);
}

export async function getAlbumById(albumId) {
  await delay();
  const album = findAlbum(albumId);
  return { ...withPrivacy(album), photos: mockPhotos[albumId] || [] };
}

export async function archiveAlbum(albumId) {
  await delay();
  const album = findAlbum(albumId);
  album.status = "archived";
  album.updatedAt = new Date().toISOString();
  return withPrivacy(album);
}

export async function restoreAlbum(albumId) {
  await delay();
  const album = findAlbum(albumId);
  album.status = "active";
  album.updatedAt = new Date().toISOString();
  return withPrivacy(album);
}

export async function deleteAlbum(albumId) {
  await delay();
  const index = mockAlbums.findIndex((a) => a.id === albumId);
  if (index === -1) throw new Error("Album not found");
  const [removed] = mockAlbums.splice(index, 1);
  albumPasswords.delete(removed.id);
  return removed;
}

export async function createAlbum(data) {
  await delay();
  let clientId = data.clientId;

  if (data.clientMode === "new" && data.newClientName) {
    const newClient = {
      id: `cli_${Date.now()}`,
      fullName: data.newClientName,
      email: "",
      phone: "",
      notes: "",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    clientId = newClient.id;
  }

  // New albums honour the studio's default preferences.
  const prefs = getPreferencesSync();
  const shareImmediately = prefs.defaultAlbumAccess === "share";

  const newAlbum = {
    id: `alb_${Date.now()}`,
    title: data.title,
    description: data.description || "",
    eventDate: data.eventDate || null,
    coverPhotoUrl: null,
    status: shareImmediately ? "active" : "draft",
    photoCount: 0,
    clientId: clientId || null,
    accessToken: `tok_${Math.random().toString(36).substring(2, 10)}`,
    accessEnabled: shareImmediately,
    allowDownload: prefs.defaultDownload !== false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockAlbums.unshift(newAlbum);
  mockPhotos[newAlbum.id] = [];

  if (data.password) albumPasswords.set(newAlbum.id, data.password);

  return withPrivacy(newAlbum);
}

export async function updateAlbum(albumId, data) {
  await delay();
  const album = findAlbum(albumId);
  if (data.title !== undefined) album.title = data.title;
  if (data.description !== undefined) album.description = data.description;
  if (data.eventDate !== undefined) album.eventDate = data.eventDate;
  if (data.clientId !== undefined) album.clientId = data.clientId;
  album.updatedAt = new Date().toISOString();
  return withPrivacy(album);
}

/* ---------- Privacy mutations ---------- */

export async function setAccessEnabled(albumId, enabled) {
  await delay();
  const album = findAlbum(albumId);
  album.accessEnabled = enabled;
  album.updatedAt = new Date().toISOString();
  return withPrivacy(album);
}

export async function setDownloadPermission(albumId, allow) {
  await delay();
  const album = findAlbum(albumId);
  album.allowDownload = allow;
  album.updatedAt = new Date().toISOString();
  return withPrivacy(album);
}

export async function setAlbumPassword(albumId, password) {
  await delay();
  findAlbum(albumId);
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  albumPasswords.set(albumId, password);
  return withPrivacy(mockAlbums.find((a) => a.id === albumId));
}

export async function removeAlbumPassword(albumId) {
  await delay();
  findAlbum(albumId);
  albumPasswords.delete(albumId);
  return withPrivacy(mockAlbums.find((a) => a.id === albumId));
}

export async function regenerateAlbumLink(albumId) {
  await delay();
  const album = findAlbum(albumId);
  album.accessToken = `tok_${Math.random().toString(36).substring(2, 10)}`;
  album.updatedAt = new Date().toISOString();
  return withPrivacy(album);
}
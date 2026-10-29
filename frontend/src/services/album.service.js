import { mockAlbums } from "../mocks/albums.mock";
import { mockPhotos } from "../mocks/photos.mock";
import { mockClients } from "../mocks/clients.mock";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAlbums() {
  await delay();
  return mockAlbums.map((album) => ({
    ...album,
    clientName: mockClients.find((c) => c.id === album.clientId)?.fullName || null,
  }));
}

export async function getAlbumById(albumId) {
  await delay();
  const album = mockAlbums.find((a) => a.id === albumId);
  if (!album) throw new Error("Album not found");
  return {
    ...album,
    clientName: mockClients.find((c) => c.id === album.clientId)?.fullName || null,
    photos: mockPhotos[albumId] || [],
  };
}

export async function archiveAlbum(albumId) {
  await delay();
  const album = mockAlbums.find((a) => a.id === albumId);
  if (!album) throw new Error("Album not found");
  album.status = "archived";
  album.updatedAt = new Date().toISOString();
  return { ...album };
}

export async function restoreAlbum(albumId) {
  await delay();
  const album = mockAlbums.find((a) => a.id === albumId);
  if (!album) throw new Error("Album not found");
  album.status = "active";
  album.updatedAt = new Date().toISOString();
  return { ...album };
}

export async function deleteAlbum(albumId) {
  await delay();
  const index = mockAlbums.findIndex((a) => a.id === albumId);
  if (index === -1) throw new Error("Album not found");
  const [removed] = mockAlbums.splice(index, 1);
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
      createdAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    clientId = newClient.id;
  }

  const newAlbum = {
    id: `alb_${Date.now()}`,
    title: data.title,
    description: data.description || "",
    eventDate: data.eventDate || null,
    coverPhotoUrl: null,
    status: "draft",
    photoCount: 0,
    clientId: clientId || null,
    accessToken: `tok_${Math.random().toString(36).substring(2, 10)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockAlbums.unshift(newAlbum);
  mockPhotos[newAlbum.id] = [];

  return {
    ...newAlbum,
    clientName: mockClients.find((c) => c.id === newAlbum.clientId)?.fullName || null,
  };
}

export async function updateAlbum(albumId, data) {
  await delay();
  const album = mockAlbums.find((a) => a.id === albumId);
  if (!album) throw new Error("Album not found");

  if (data.title !== undefined) album.title = data.title;
  if (data.description !== undefined) album.description = data.description;
  if (data.eventDate !== undefined) album.eventDate = data.eventDate;
  if (data.clientId !== undefined) album.clientId = data.clientId;

  album.updatedAt = new Date().toISOString();

  return {
    ...album,
    clientName: mockClients.find((c) => c.id === album.clientId)?.fullName || null,
  };
}
import { albums, clients, saveAlbums, saveClients } from "../mocks/store";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

function findClient(clientId) {
  const client = clients.find((c) => c.id === clientId);
  if (!client) throw new Error("Client not found");
  return client;
}

function latestAlbumFor(clientId) {
  const list = albums.filter((a) => a.clientId === clientId);
  if (list.length === 0) return null;
  const sorted = [...list].sort(
    (a, b) => new Date(b.eventDate || b.updatedAt) - new Date(a.eventDate || a.updatedAt)
  );
  const top = sorted[0];
  return { id: top.id, title: top.title, eventDate: top.eventDate };
}

function decorate(client) {
  return {
    ...client,
    albumCount: albums.filter((a) => a.clientId === client.id).length,
    latestAlbum: latestAlbumFor(client.id),
  };
}

export async function getClients() {
  await delay();
  return clients
    .map(decorate)
    .sort((a, b) => {
      if (a.status === b.status) return new Date(b.updatedAt) - new Date(a.updatedAt);
      return a.status === "archived" ? 1 : -1;
    });
}

export async function getClientById(clientId) {
  await delay(250);
  return decorate(findClient(clientId));
}

export async function createClient(data) {
  await delay();
  const newClient = {
    id: `cli_${Date.now()}`,
    fullName: data.fullName.trim(),
    email: data.email?.trim() || "",
    phone: data.phone?.trim() || "",
    notes: data.notes?.trim() || "",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  clients.push(newClient);
  saveClients();
  return decorate(newClient);
}

export async function updateClient(clientId, data) {
  await delay();
  const client = findClient(clientId);
  if (data.fullName !== undefined) client.fullName = data.fullName.trim();
  if (data.email !== undefined) client.email = data.email?.trim() || "";
  if (data.phone !== undefined) client.phone = data.phone?.trim() || "";
  if (data.notes !== undefined) client.notes = data.notes?.trim() || "";
  client.updatedAt = new Date().toISOString();
  saveClients();
  return decorate(client);
}

export async function archiveClient(clientId) {
  await delay();
  const client = findClient(clientId);
  client.status = "archived";
  client.updatedAt = new Date().toISOString();
  saveClients();
  return decorate(client);
}

export async function restoreClient(clientId) {
  await delay();
  const client = findClient(clientId);
  client.status = "active";
  client.updatedAt = new Date().toISOString();
  saveClients();
  return decorate(client);
}

export async function deleteClient(clientId) {
  await delay();
  const index = clients.findIndex((c) => c.id === clientId);
  if (index === -1) throw new Error("Client not found");
  const [removed] = clients.splice(index, 1);
  // Consequence: albums survive but become unassigned (never deleted).
  albums.forEach((album) => {
    if (album.clientId === clientId) {
      album.clientId = null;
      album.updatedAt = new Date().toISOString();
    }
  });
  saveClients();
  saveAlbums();
  return removed;
}
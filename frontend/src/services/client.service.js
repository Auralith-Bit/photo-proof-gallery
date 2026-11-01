import { api } from "../lib/api";

export async function getClients() {
  return await api.get("/clients");
}

export async function getClientById(clientId) {
  return await api.get(`/clients/${clientId}`);
}

export async function createClient(data) {
  return await api.post("/clients", data);
}

export async function updateClient(clientId, data) {
  return await api.patch(`/clients/${clientId}`, data);
}

export async function archiveClient(clientId) {
  return await api.post(`/clients/${clientId}/archive`);
}

export async function restoreClient(clientId) {
  return await api.post(`/clients/${clientId}/restore`);
}

export async function deleteClient(clientId) {
  return await api.delete(`/clients/${clientId}`);
}
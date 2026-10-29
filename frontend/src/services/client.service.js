import { mockClients } from "../mocks/clients.mock";
import { mockAlbums } from "../mocks/albums.mock";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function getClients() {
  await delay();
  return mockClients.map(client => ({
    ...client,
    albumCount: mockAlbums.filter(a => a.clientId === client.id).length
  }));
}
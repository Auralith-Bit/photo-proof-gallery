import { mockStorage } from "../mocks/storage.mock";
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function getStorageInfo() {
  await delay();
  return mockStorage;
}
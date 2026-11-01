import { api } from "../lib/api";

export async function getStorageInfo() {
  try {
    return await api.get("/settings/storage");
  } catch {
    return {
      usedBytes: 0,
      totalBytes: 50 * 1024 * 1024 * 1024,
    };
  }
}
import { api } from "../lib/api";

export async function getRecentActivity() {
  try {
    return await api.get("/settings/activity");
  } catch {
    return [];
  }
}
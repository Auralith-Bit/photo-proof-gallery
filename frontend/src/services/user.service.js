import { getCurrentUser } from "./auth.service";

export async function getUser() {
  return await getCurrentUser();
}
import { api } from "../lib/api";

function nameFromEmail(email) {
  const local = (String(email).split("@")[0] || "").replace(/[._-]+/g, " ").trim();
  if (!local) return "Photographer";
  return local
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password });
  return data;
}

export async function register({ name, email, password }) {
  const data = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function logout() {
  const data = await api.post("/auth/logout");
  return data;
}

export async function getCurrentUser() {
  const data = await api.get("/auth/me");
  return data?.user || data;
}

export async function requestPasswordReset(email) {
  return await api.post("/auth/forgot-password", { email });
}

export async function resetPassword({ token, password }) {
  return await api.post("/auth/reset-password", { token, password });
}
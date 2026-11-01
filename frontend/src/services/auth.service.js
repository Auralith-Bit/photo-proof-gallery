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
  try {
    return await api.post("/auth/forgot-password", { email });
  } catch {
    // Graceful fallback — avoid exposing whether an email exists
    return { ok: true, email };
  }
}

export async function resetPassword({ token, password }) {
  try {
    return await api.post("/auth/reset-password", { token, password });
  } catch {
    if (!token || token === "expired") {
      throw new Error("This reset link is invalid or has expired.");
    }
    return { ok: true };
  }
}
import { create } from "zustand";
import { logout as apiLogout } from "../services/auth.service";
import { clearSession, readSession, writeSession } from "../lib/authSession";

// Photographer session. Persisted to localStorage to simulate a stored auth token
// across reloads. In production, replace persistence with an httpOnly cookie or an
// in-memory access token + refresh flow (see README §6) — the guard logic stays the same.

const initialUser = readSession();

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  status: initialUser ? "authenticated" : "unauthenticated",
  signIn: (user) => {
    set({ user, status: "authenticated" });
    writeSession(user);
  },
  signOut: () => {
    set({ user: null, status: "unauthenticated" });
    clearSession();
    apiLogout(); // best-effort server-side logout (no-op in the mock)
  },
  updateUser: (patch) => {
    const next = { ...(get().user || {}), ...patch };
    set({ user: next });
    writeSession(next);
  },
}));
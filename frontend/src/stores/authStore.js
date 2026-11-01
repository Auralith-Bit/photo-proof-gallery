import { create } from "zustand";
import { logout as apiLogout } from "../services/auth.service";

// Photographer session. Persisted to localStorage to simulate a stored auth token
// across reloads. In production, replace persistence with an httpOnly cookie or an
// in-memory access token + refresh flow (see README §6) — the guard logic stays the same.
const KEY = "frameora:auth";

function hydrate() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* corrupt / unavailable -> treat as signed out */
  }
  return null;
}

function persist(user) {
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage disabled -> session lives in memory only this tab */
  }
}

const initialUser = hydrate();

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  status: initialUser ? "authenticated" : "unauthenticated",
  signIn: (user) => {
    set({ user, status: "authenticated" });
    persist(user);
  },
  signOut: () => {
    set({ user: null, status: "unauthenticated" });
    persist(null);
    apiLogout(); // best-effort server-side logout (no-op in the mock)
  },
  updateUser: (patch) => {
    const next = { ...(get().user || {}), ...patch };
    set({ user: next });
    persist(next);
  },
}));
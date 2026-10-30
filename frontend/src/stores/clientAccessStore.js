import { create } from "zustand";

// Authorization sessions. Deliberately NOT persisted to localStorage:
// reloading the page must return the client to the password gate.
export const useClientSessionStore = create((set, get) => ({
  sessions: {}, // accessToken -> authorized payload (album, branding, photos, allowDownload)
  authorize: (accessToken, payload) =>
    set((s) => ({ sessions: { ...s.sessions, [accessToken]: payload } })),
  getSession: (accessToken) => get().sessions[accessToken] || null,
  revoke: (accessToken) =>
    set((s) => {
      const next = { ...s.sessions };
      delete next[accessToken];
      return { sessions: next };
    }),
}));
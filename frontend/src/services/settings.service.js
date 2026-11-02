import { api } from "../lib/api";

const store = {
  profile: {
    displayName: "",
    email: "",
    emailVerified: true,
    imageUrl: null,
    imageName: "",
  },
  security: {
    passwordUpdatedAt: new Date().toISOString(),
    notifyOnNewDevice: true,
    notifyOnClientAccess: false,
    sessions: [
      {
        id: "ses_current",
        current: true,
        device: "This device",
        browser: "Chrome on Windows",
        location: "Current Location",
        lastActive: new Date().toISOString(),
      },
    ],
  },
  branding: {
    studioName: "",
    logoUrl: null,
    logoName: "",
    logoStyle: "both",
    showFooter: true,
    footerText: "",
  },
  preferences: {
    defaultAlbumAccess: "private",
    defaultDownload: true,
    viewPreference: "grid",
    notifyClientAccess: true,
    notifyLowStorage: true,
  },
};

/* ---- sync getters consumed by other services (no async needed) ---- */
export function getPreferencesSync() {
  return { ...store.preferences };
}

export function getBrandingSync() {
  return { ...store.branding };
}

/* ---- profile ---- */
export async function getProfile() {
  try {
    const data = await api.get("/settings/profile");
    store.profile = { ...store.profile, ...data };
    return { ...store.profile };
  } catch {
    return { ...store.profile };
  }
}

export async function updateProfile(data) {
  const res = await api.put("/settings/profile", data);
  store.profile = { ...store.profile, ...res };
  return res;
}

export async function resendVerification() {
  return { ok: true, email: store.profile.email };
}

/* ---- security ---- */
export async function getSecurity() {
  try {
    const data = await api.get("/settings/security");
    store.security = { ...store.security, ...data };
    return { ...store.security };
  } catch {
    return { ...store.security };
  }
}

export async function changePassword({ currentPassword, newPassword }) {
  return await api.post("/settings/change-password", { currentPassword, newPassword });
}

export async function updateSecurityPrefs({ notifyOnNewDevice, notifyOnClientAccess }) {
  const res = await api.put("/settings/security", { notifyOnNewDevice, notifyOnClientAccess });
  store.security = { ...store.security, ...res };
  return res;
}

export async function revokeSession(sessionId) {
  store.security.sessions = store.security.sessions.filter((s) => s.id !== sessionId);
  return store.security.sessions;
}

export async function revokeOtherSessions() {
  store.security.sessions = store.security.sessions.filter((s) => s.current);
  return store.security.sessions;
}

/* ---- branding ---- */
export async function getBranding() {
  try {
    const data = await api.get("/settings/branding");
    store.branding = { ...store.branding, ...data };
    return { ...store.branding };
  } catch {
    return { ...store.branding };
  }
}

export async function updateBranding(data) {
  const res = await api.put("/settings/branding", data);
  store.branding = { ...store.branding, ...res };
  return res;
}

/* ---- preferences ---- */
export async function getPreferences() {
  try {
    const data = await api.get("/settings/preferences");
    store.preferences = { ...store.preferences, ...data };
    return { ...store.preferences };
  } catch {
    return { ...store.preferences };
  }
}

export async function updatePreferences(data) {
  const res = await api.put("/settings/preferences", data);
  store.preferences = { ...store.preferences, ...res };
  return res;
}

/**
 * Priority 2 — Uploads an avatar or logo image to the backend (→ Cloudinary).
 * Returns { url, publicId } with a persistent CDN URL.
 * @param {File} file  - The raw File object from the browser
 * @param {"avatar"|"logo"} type
 */
export async function uploadSettingsImage(file, type = "avatar") {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(
    `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/settings/upload-image?type=${type}`,
    {
      method: "POST",
      credentials: "include",
      body: form,
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Image upload failed.");
  }
  return res.json(); // { url, publicId }
}
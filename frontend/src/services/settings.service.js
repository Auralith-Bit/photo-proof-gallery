import { mockProfile, mockSecurity, mockBranding, mockPreferences } from "../mocks/settings.mock";

const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

// In-session store. Saves actually stick while the app is open, satisfying
// "only show settings that exist and can be saved".
const store = {
  profile: { ...mockProfile },
  security: {
    ...mockSecurity,
    sessions: mockSecurity.sessions.map((s) => ({ ...s })),
  },
  branding: { ...mockBranding },
  preferences: { ...mockPreferences },
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
  await delay(250);
  return { ...store.profile };
}
export async function updateProfile(data) {
  await delay();
  const emailChanged = data.email.trim().toLowerCase() !== store.profile.email.toLowerCase();
  store.profile.displayName = data.displayName.trim();
  store.profile.email = data.email.trim();
  if (data.imageUrl !== undefined) {
    store.profile.imageUrl = data.imageUrl;
    store.profile.imageName = data.imageName || "";
  }
  if (emailChanged) store.profile.emailVerified = false; // changing email resets verification
  return { ...store.profile, emailChanged };
}
export async function resendVerification() {
  await delay();
  return { ok: true, email: store.profile.email };
}

/* ---- security ---- */
export async function getSecurity() {
  await delay(250);
  return { ...store.security, sessions: store.security.sessions.map((s) => ({ ...s })) };
}
export async function changePassword({ currentPassword, newPassword }) {
  await delay();
  if (!currentPassword) throw new Error("Enter your current password.");
  if (currentPassword === "wrong") throw new Error("Your current password is incorrect.");
  store.security.passwordUpdatedAt = new Date().toISOString();
  return { passwordUpdatedAt: store.security.passwordUpdatedAt };
}
export async function updateSecurityPrefs({ notifyOnNewDevice, notifyOnClientAccess }) {
  await delay(250);
  if (notifyOnNewDevice !== undefined) store.security.notifyOnNewDevice = notifyOnNewDevice;
  if (notifyOnClientAccess !== undefined) store.security.notifyOnClientAccess = notifyOnClientAccess;
  return { ...store.security };
}
export async function revokeSession(sessionId) {
  await delay(250);
  const target = store.security.sessions.find((s) => s.id === sessionId);
  if (!target) throw new Error("Session not found");
  if (target.current) throw new Error("You can't revoke the current session.");
  store.security.sessions = store.security.sessions.filter((s) => s.id !== sessionId);
  return store.security.sessions.map((s) => ({ ...s }));
}
export async function revokeOtherSessions() {
  await delay();
  store.security.sessions = store.security.sessions.filter((s) => s.current);
  return store.security.sessions.map((s) => ({ ...s }));
}

/* ---- branding ---- */
export async function getBranding() {
  await delay(250);
  return { ...store.branding };
}
export async function updateBranding(data) {
  await delay();
  store.branding.studioName = data.studioName.trim();
  store.branding.logoStyle = data.logoStyle;
  store.branding.showFooter = data.showFooter;
  store.branding.footerText = (data.footerText || "").trim();
  if (data.logoUrl !== undefined) {
    store.branding.logoUrl = data.logoUrl;
    store.branding.logoName = data.logoName || "";
  }
  return { ...store.branding };
}

/* ---- preferences ---- */
export async function getPreferences() {
  await delay(250);
  return { ...store.preferences };
}
export async function updatePreferences(data) {
  await delay();
  store.preferences = { ...store.preferences, ...data };
  return { ...store.preferences };
}
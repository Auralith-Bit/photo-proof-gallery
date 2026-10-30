import { mockAlbums } from "../mocks/albums.mock";
import { mockPhotos } from "../mocks/photos.mock";
import { getBrandingSync } from "./settings.service";
import { hasPassword, checkPassword } from "./albumSecrets.store";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory rate limiting (never persisted). albumId -> { count, lockedUntil }
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;

function findByToken(token) {
  return mockAlbums.find((a) => a.accessToken === token);
}

function err(code, message) {
  const e = new Error(message);
  e.code = code;
  return e;
}

/**
 * METADATA ONLY — safe to show before authentication.
 * Never returns the photo array. The cover is the single sanctioned teaser
 * (the password-page spec explicitly lists "optional album cover photograph");
 * no other private photograph is exposed until access is verified.
 */
export async function resolveAlbumByToken(token) {
  await delay(350);
  const album = findByToken(token);
  if (!album) throw err("INVALID_LINK", "This link doesn't look right.");

  return {
    id: album.id,
    title: album.title,
    description: album.description || "",
    eventDate: album.eventDate || null,
    coverPhotoUrl: album.coverPhotoUrl || null,
    status: album.status,
    accessEnabled: album.accessEnabled !== false,
    hasPassword: hasPassword(album.id),
    allowDownload: album.allowDownload !== false,
  };
}

/**
 * The only path that yields photographs. Enforces every access rule before
 * returning anything. Errors carry a `code` the UI maps to a designed state.
 */
export async function verifyAlbumAccess(token, password) {
  await delay(500);
  const album = findByToken(token);
  if (!album) throw err("INVALID_LINK", "This link doesn't look right.");
  if (album.accessEnabled === false) throw err("DISABLED", "This gallery isn't available yet.");
  if (album.status === "archived") throw err("UNAVAILABLE", "This gallery is no longer available.");

  // Rate limit (real lockout after repeated failures).
  const rec = attempts.get(album.id) || { count: 0, lockedUntil: 0 };
  if (rec.lockedUntil && Date.now() < rec.lockedUntil) {
    const e = err("RATE_LIMITED", "Too many attempts. Please wait a moment and try again.");
    e.retryAfter = Math.ceil((rec.lockedUntil - Date.now()) / 1000);
    throw e;
  }

  // Real network-failure state: testable via DevTools -> Network -> Offline.
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw err("NETWORK", "We couldn't verify your password. Check your connection and try again.");
  }

  const needsPassword = hasPassword(album.id);
  if (needsPassword && !checkPassword(album.id, password || "")) {
    rec.count += 1;
    if (rec.count >= MAX_ATTEMPTS) {
      rec.lockedUntil = Date.now() + LOCK_MS;
      rec.count = 0;
    }
    attempts.set(album.id, rec);
    throw err("INCORRECT_PASSWORD", "The password is incorrect. Please try again.");
  }

  attempts.delete(album.id); // success clears the counter

  const photos = mockPhotos[album.id] || [];
  const branding = getBrandingSync();

  return {
    sessionToken: `ses_${Math.random().toString(36).slice(2)}`,
    album: {
      id: album.id,
      title: album.title,
      description: album.description || "",
      eventDate: album.eventDate || null,
      coverPhotoUrl: album.coverPhotoUrl || null,
      photoCount: photos.length,
      allowDownload: album.allowDownload !== false,
    },
    branding: {
      studioName: branding.studioName,
      logoUrl: branding.logoUrl,
      logoStyle: branding.logoStyle,
      showFooter: branding.showFooter,
      footerText: branding.footerText,
    },
    photos,
  };
}
import crypto from "crypto";
import bcrypt from "bcryptjs";
import Album from "../models/Album.js";
import Photo from "../models/Photo.js";

// In-memory rate limiting for album password attempts: albumId -> { count, lockedUntil }
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;

function createAccessError(code, message, statusCode = 400, retryAfter = null) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  if (retryAfter) {
    error.retryAfter = retryAfter;
  }
  return error;
}

const resolveAlbumByToken = async (token) => {
  const album = await Album.findOne({ accessToken: token });
  if (!album) {
    throw createAccessError("INVALID_LINK", "This link doesn't look right.", 404);
  }

  return {
    id: album._id.toString(),
    title: album.title,
    description: album.description || "",
    eventDate: album.eventDate
      ? new Date(album.eventDate).toISOString().slice(0, 10)
      : null,
    coverPhotoUrl: album.coverPhotoUrl || null,
    status: album.status,
    accessEnabled: album.accessEnabled !== false,
    hasPassword: Boolean(album.hasPassword),
    allowDownload: album.allowDownload !== false,
  };
};

const verifyAlbumAccess = async (token, password) => {
  const album = await Album.findOne({ accessToken: token })
    .select("+password")
    .populate("photographer", "name email");

  if (!album) {
    throw createAccessError("INVALID_LINK", "This link doesn't look right.", 404);
  }

  if (album.accessEnabled === false) {
    throw createAccessError("DISABLED", "This gallery isn't available yet.", 403);
  }

  if (album.status === "archived") {
    throw createAccessError("UNAVAILABLE", "This gallery is no longer available.", 410);
  }

  const albumIdStr = album._id.toString();
  const rec = attempts.get(albumIdStr) || { count: 0, lockedUntil: 0 };

  if (rec.lockedUntil && Date.now() < rec.lockedUntil) {
    const retryAfter = Math.ceil((rec.lockedUntil - Date.now()) / 1000);
    throw createAccessError(
      "RATE_LIMITED",
      "Too many attempts. Please wait a moment and try again.",
      429,
      retryAfter
    );
  }

  const needsPassword = Boolean(album.password);
  if (needsPassword) {
    const isMatch = password ? await bcrypt.compare(password, album.password) : false;
    if (!isMatch) {
      rec.count += 1;
      if (rec.count >= MAX_ATTEMPTS) {
        rec.lockedUntil = Date.now() + LOCK_MS;
        rec.count = 0;
      }
      attempts.set(albumIdStr, rec);
      throw createAccessError(
        "INCORRECT_PASSWORD",
        "The password is incorrect. Please try again.",
        401
      );
    }
  }

  attempts.delete(albumIdStr);

  const photos = await Photo.find({ albumId: album._id }).sort({ createdAt: 1 });

  const branding = {
    studioName: album.photographer?.name
      ? `${album.photographer.name} Photography`
      : "Frameora Studio",
    logoUrl: null,
    logoStyle: "dark",
    showFooter: true,
    footerText: `© ${new Date().getFullYear()} All rights reserved.`,
  };

  return {
    sessionToken: `ses_${crypto.randomBytes(16).toString("hex")}`,
    album: {
      id: album._id.toString(),
      title: album.title,
      description: album.description || "",
      eventDate: album.eventDate
        ? new Date(album.eventDate).toISOString().slice(0, 10)
        : null,
      coverPhotoUrl: album.coverPhotoUrl || null,
      photoCount: photos.length || album.photoCount || 0,
      allowDownload: album.allowDownload !== false,
    },
    branding,
    photos: photos.map((p) => (p.toJSON ? p.toJSON() : p)),
  };
};

export default {
  resolveAlbumByToken,
  verifyAlbumAccess,
};

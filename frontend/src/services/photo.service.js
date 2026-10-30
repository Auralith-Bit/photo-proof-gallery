import { albums, photos, saveAlbums, savePhotos } from "../mocks/store";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Set > 0 (e.g. 0.08) to demo the failed/retry upload state.
const FAIL_RATE = 0;

// Tracks object-URL fallbacks (e.g. HEIC that can't be canvas-decoded) so we can
// revoke them on delete. Data URLs need no revocation.
const objectUrlRegistry = new Map(); // photoId -> objectUrl

function assertAlbum(albumId) {
  if (!photos[albumId] && !albums.some((a) => a.id === albumId)) {
    throw new Error("Album not found");
  }
}

function syncAlbumPhotoCount(albumId) {
  const album = albums.find((a) => a.id === albumId);
  if (album) album.photoCount = (photos[albumId] || []).length;
}

/* ---- turn an uploaded File into real, serializable image data ---- */
function loadImageEl(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode-failed"));
    };
    img.src = url;
  });
}

function drawToDataUrl(img, maxEdge) {
  const ratio = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * ratio));
  const h = Math.max(1, Math.round(img.height * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.85);
}

async function fileToImageUrls(file) {
  try {
    const { img, url } = await loadImageEl(file);
    try {
      return {
        thumbnailUrl: drawToDataUrl(img, 480),
        url: drawToDataUrl(img, 1400),
        trackUrl: null, // temp object url revoked below
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    // Cannot decode (e.g. HEIC in some browsers): fall back to an object URL for
    // this session. It won't survive a reload, but the tile degrades gracefully.
    const objectUrl = URL.createObjectURL(file);
    return { thumbnailUrl: objectUrl, url: objectUrl, trackUrl: objectUrl };
  }
}

export async function getPhotosByAlbum(albumId) {
  await delay(300);
  return photos[albumId] || [];
}

export async function uploadPhoto(albumId, file, options = {}) {
  const { onProgress, signal } = options;
  assertAlbum(albumId);

  const aborted = () => {
    const error = new Error("Upload cancelled.");
    error.code = "ABORTED";
    return error;
  };
  const checkAbort = () => {
    if (signal?.aborted) throw aborted();
  };

  // Transfer phase: 0 -> 90%
  const steps = 8;
  for (let i = 1; i <= steps; i += 1) {
    checkAbort();
    await sleep(110 + Math.random() * 130);
    onProgress?.(Math.round((i / steps) * 90));
  }
  checkAbort();

  // Encode the real file (this is the "processing" stage).
  onProgress?.(95);
  const { thumbnailUrl, url, trackUrl } = await fileToImageUrls(file);
  checkAbort();
  await sleep(250);

  if (FAIL_RATE > 0 && Math.random() < FAIL_RATE) {
    if (trackUrl) URL.revokeObjectURL(trackUrl);
    throw new Error("Upload failed due to a network error.");
  }

  const photo = {
    id: `ph_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    albumId,
    filename: file.name,
    url,
    thumbnailUrl,
    width: 1400,
    height: 1050,
    isCover: false,
    uploadedAt: new Date().toISOString(),
  };

  if (!photos[albumId]) photos[albumId] = [];
  photos[albumId].push(photo);
  if (trackUrl) objectUrlRegistry.set(photo.id, trackUrl);

  // First photo in an empty album becomes the cover so the card shows your image.
  const album = albums.find((a) => a.id === albumId);
  if (album && !album.coverPhotoUrl && photos[albumId].length === 1) {
    photo.isCover = true;
    album.coverPhotoUrl = thumbnailUrl;
    album.updatedAt = new Date().toISOString();
    saveAlbums();
  }

  syncAlbumPhotoCount(albumId);
  savePhotos();
  onProgress?.(100);
  return photo;
}

export async function deletePhoto(albumId, photoId) {
  await delay(300);
  if (!photos[albumId]) throw new Error("Album not found");
  const index = photos[albumId].findIndex((p) => p.id === photoId);
  if (index === -1) throw new Error("Photo not found");
  const [removed] = photos[albumId].splice(index, 1);

  const tracked = objectUrlRegistry.get(photoId);
  if (tracked) {
    URL.revokeObjectURL(tracked);
    objectUrlRegistry.delete(photoId);
  }

  // If the deleted photo was the cover, promote the next one (or clear).
  const album = albums.find((a) => a.id === albumId);
  if (album && removed?.isCover) {
    const next = photos[albumId][0] || null;
    if (next) {
      next.isCover = true;
      album.coverPhotoUrl = next.thumbnailUrl;
    } else {
      album.coverPhotoUrl = null;
    }
    album.updatedAt = new Date().toISOString();
    saveAlbums();
  }

  syncAlbumPhotoCount(albumId);
  savePhotos();
  return removed;
}

export async function setCoverPhoto(albumId, photoId) {
  await delay(300);
  if (!photos[albumId]) throw new Error("Album not found");
  let cover = null;
  photos[albumId].forEach((p) => {
    p.isCover = p.id === photoId;
    if (p.isCover) cover = p;
  });
  const album = albums.find((a) => a.id === albumId);
  if (album && cover) {
    album.coverPhotoUrl = cover.thumbnailUrl;
    album.updatedAt = new Date().toISOString();
    saveAlbums();
  }
  savePhotos();
  return cover;
}
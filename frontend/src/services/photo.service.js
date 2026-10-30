import { mockPhotos } from "../mocks/photos.mock";
import { mockAlbums } from "../mocks/albums.mock";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assertAlbum(albumId) {
  if (!mockPhotos[albumId] && !mockAlbums.some((a) => a.id === albumId)) {
    throw new Error("Album not found");
  }
}

function syncAlbumPhotoCount(albumId) {
  const album = mockAlbums.find((a) => a.id === albumId);
  if (album) album.photoCount = (mockPhotos[albumId] || []).length;
}

export async function getPhotosByAlbum(albumId) {
  await delay(300);
  return mockPhotos[albumId] || [];
}

export async function uploadPhoto(albumId, file, options = {}) {
  const { onProgress, signal } = options;
  assertAlbum(albumId);

  const aborted = () => {
    const error = new Error("Upload cancelled.");
    error.code = "ABORTED";
    return error;
  };

  // Transfer phase: 0 -> 90%
  const steps = 8;
  for (let i = 1; i <= steps; i += 1) {
    if (signal?.aborted) throw aborted();
    await sleep(110 + Math.random() * 130);
    onProgress?.(Math.round((i / steps) * 90));
  }
  if (signal?.aborted) throw aborted();

  // Processing phase: 95%
  onProgress?.(95);
  await sleep(550);
  if (signal?.aborted) throw aborted();

  // Commit (simulated 5% network failure)
  if (Math.random() < 0.05) {
    throw new Error("Upload failed due to a network error.");
  }

  const seed = Math.random().toString(36).substring(2, 10);
  const newPhoto = {
    id: `ph_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    albumId,
    filename: file.name,
    url: `https://picsum.photos/seed/${seed}/1200/800`,
    thumbnailUrl: `https://picsum.photos/seed/${seed}/400/300`,
    width: 1200,
    height: 800,
    isCover: false,
    uploadedAt: new Date().toISOString(),
  };

  if (!mockPhotos[albumId]) mockPhotos[albumId] = [];
  mockPhotos[albumId].push(newPhoto);
  syncAlbumPhotoCount(albumId);

  onProgress?.(100);
  return newPhoto;
}

export async function deletePhoto(albumId, photoId) {
  await delay(300);
  if (!mockPhotos[albumId]) throw new Error("Album not found");
  const index = mockPhotos[albumId].findIndex((p) => p.id === photoId);
  if (index === -1) throw new Error("Photo not found");
  const [removed] = mockPhotos[albumId].splice(index, 1);
  syncAlbumPhotoCount(albumId);
  return removed;
}

export async function setCoverPhoto(albumId, photoId) {
  await delay(300);
  if (!mockPhotos[albumId]) throw new Error("Album not found");
  mockPhotos[albumId].forEach((p) => {
    p.isCover = p.id === photoId;
  });
  return mockPhotos[albumId].find((p) => p.id === photoId);
}
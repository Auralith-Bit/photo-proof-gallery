import { mockPhotos } from "../mocks/photos.mock";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPhotosByAlbum(albumId) {
  await delay(300);
  return mockPhotos[albumId] || [];
}

export async function uploadPhoto(albumId, file) {
  // Simulate upload delay (300-800ms)
  await delay(300 + Math.random() * 500);

  // Simulate occasional failure (5%)
  if (Math.random() < 0.05) {
    throw new Error("Upload failed due to network error.");
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
  return newPhoto;
}

export async function deletePhoto(albumId, photoId) {
  await delay(300);
  if (!mockPhotos[albumId]) throw new Error("Album not found");
  const index = mockPhotos[albumId].findIndex((p) => p.id === photoId);
  if (index === -1) throw new Error("Photo not found");
  const [removed] = mockPhotos[albumId].splice(index, 1);
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
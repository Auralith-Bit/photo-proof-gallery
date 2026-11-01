import { api } from "../lib/api";

export async function getPhotosByAlbum(albumId) {
  return await api.get(`/albums/${albumId}/photos`);
}

export async function uploadPhoto(albumId, file, options = {}) {
  const { onProgress, signal } = options;
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = `/api/albums/${albumId}/photos`;

    xhr.open("POST", url);
    xhr.withCredentials = true;

    if (signal) {
      if (signal.aborted) {
        const err = new Error("Upload cancelled.");
        err.code = "ABORTED";
        return reject(err);
      }
      signal.addEventListener("abort", () => {
        xhr.abort();
        const err = new Error("Upload cancelled.");
        err.code = "ABORTED";
        reject(err);
      });
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(95, Math.round((event.loaded / event.total) * 90));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          onProgress?.(100);
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch {
          resolve(xhr.responseText);
        }
      } else {
        let message = `Upload failed with status ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText);
          message = errData.message || message;
        } catch {}
        reject(new Error(message));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during photo upload."));
    };

    onProgress?.(5);
    xhr.send(formData);
  });
}

export async function deletePhoto(albumId, photoId) {
  return await api.delete(`/albums/${albumId}/photos/${photoId}`);
}

export async function setCoverPhoto(albumId, photoId) {
  return await api.put(`/albums/${albumId}/cover/${photoId}`);
}
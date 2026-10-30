import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { uploadPhoto } from "../services/photo.service";
import { toast } from "../stores/toastStore";

const MAX_CONCURRENT = 3;
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

let seq = 0;
const nextId = () => `up_${Date.now()}_${(seq += 1)}`;

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported file type. Use JPEG, PNG, WebP, or HEIC.";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "File is larger than the 25 MB limit.";
  }
  return null;
}

export function useUploadQueue() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState([]);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const controllersRef = useRef(new Map()); // id -> AbortController
  const urlsRef = useRef(new Set()); // created object URLs to revoke
  const runningRef = useRef(0);
  const albumRef = useRef(null); // current target album

  const patch = useCallback((id, changes) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...changes } : it)));
  }, []);

  const invalidateAlbum = useCallback(
    (albumId) => {
      queryClient.invalidateQueries({ queryKey: ["photos", albumId] });
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    [queryClient]
  );

  const runItem = useCallback(
    async (id) => {
      const item = itemsRef.current.find((it) => it.id === id);
      if (!item) return;
      const albumId = item.albumId;

      const controller = new AbortController();
      controllersRef.current.set(id, controller);
      runningRef.current += 1;
      patch(id, { status: "uploading", progress: 0, error: undefined });

      try {
        const photo = await uploadPhoto(albumId, item.file, {
          signal: controller.signal,
          onProgress: (p) => {
            const status = p >= 100 ? "completed" : p >= 95 ? "processing" : "uploading";
            patch(id, { progress: p, status });
          },
        });
        patch(id, { status: "completed", progress: 100, photoId: photo.id });
        invalidateAlbum(albumId);
      } catch (error) {
        if (error?.code === "ABORTED") {
          patch(id, { status: "cancelled" });
        } else {
          patch(id, { status: "failed", error: error?.message || "Upload failed." });
          toast.error(`"${item.name}" failed to upload.`);
        }
      } finally {
        controllersRef.current.delete(id);
        runningRef.current -= 1;
        pumpRef.current();
      }
    },
    [patch, invalidateAlbum]
  );

  const pump = useCallback(() => {
    if (runningRef.current >= MAX_CONCURRENT) return;
    const next = itemsRef.current.find((it) => it.status === "queued");
    if (!next) return;
    runItem(next.id);
  }, [runItem]);

  const pumpRef = useRef(pump);
  pumpRef.current = pump;

  const setAlbum = useCallback((albumId) => {
    albumRef.current = albumId;
  }, []);

  const addFiles = useCallback(
    (files) => {
      const albumId = albumRef.current;
      if (!albumId) return;

      const list = Array.from(files);
      const seen = new Set(
        itemsRef.current
          .filter((it) => it.status !== "rejected" && it.status !== "cancelled")
          .map((it) => `${it.name}:${it.size}:${it.lastModified}`)
      );

      const additions = [];
      for (const file of list) {
        const fingerprint = `${file.name}:${file.size}:${file.lastModified}`;
        if (seen.has(fingerprint)) continue; // duplicate guard
        seen.add(fingerprint);

        const rejection = validateFile(file);
        const previewUrl = URL.createObjectURL(file);
        urlsRef.current.add(previewUrl);

        additions.push({
          id: nextId(),
          albumId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          previewUrl,
          status: rejection ? "rejected" : "queued",
          progress: 0,
          error: rejection || undefined,
        });
      }

      if (additions.length === 0) {
        toast.info("Those photos are already in the queue.");
        return;
      }

      setItems((prev) => [...prev, ...additions]);
      // let state commit, then start the pool
      setTimeout(() => pumpRef.current(), 0);
    },
    []
  );

  const cancelItem = useCallback((id) => {
    controllersRef.current.get(id)?.abort();
  }, []);

  const retryItem = useCallback(
    (id) => {
      patch(id, { status: "queued", progress: 0, error: undefined });
      setTimeout(() => pumpRef.current(), 0);
    },
    [patch]
  );

  const removeItem = useCallback((id) => {
    controllersRef.current.get(id)?.abort();
    controllersRef.current.delete(id);
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
        urlsRef.current.delete(target.previewUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const cancelAll = useCallback(() => {
    controllersRef.current.forEach((controller) => controller.abort());
  }, []);

  const clearFinished = useCallback(() => {
    setItems((prev) => {
      prev.forEach((it) => {
        if (["completed", "cancelled", "rejected"].includes(it.status) && it.previewUrl) {
          URL.revokeObjectURL(it.previewUrl);
          urlsRef.current.delete(it.previewUrl);
        }
      });
      return prev.filter((it) => !["completed", "cancelled", "rejected"].includes(it.status));
    });
  }, []);

  // revoke every outstanding object URL on unmount
  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
      controllersRef.current.forEach((c) => c.abort());
      controllersRef.current.clear();
    };
  }, []);

  const stats = {
    total: items.length,
    queued: items.filter((i) => i.status === "queued").length,
    uploading: items.filter((i) => i.status === "uploading").length,
    processing: items.filter((i) => i.status === "processing").length,
    completed: items.filter((i) => i.status === "completed").length,
    failed: items.filter((i) => i.status === "failed").length,
    cancelled: items.filter((i) => i.status === "cancelled").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };
  const active = stats.queued + stats.uploading + stats.processing;
  const countable = items.filter((i) => i.status !== "rejected" && i.status !== "cancelled");
  const overall =
    countable.length === 0
      ? 0
      : Math.round(
          countable.reduce((sum, i) => sum + (i.status === "completed" ? 100 : i.progress), 0) /
            countable.length
        );

  return {
    items,
    stats,
    active,
    overall,
    setAlbum,
    addFiles,
    cancelItem,
    retryItem,
    removeItem,
    cancelAll,
    clearFinished,
  };
}
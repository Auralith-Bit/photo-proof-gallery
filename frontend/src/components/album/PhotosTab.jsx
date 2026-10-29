import { useState, useRef } from "react";
import { Check, Images, Trash2, X } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import ConfirmDialog from "../ui/ConfirmDialog";
import Spinner from "../ui/Spinner";
import UploadDropzone from "./UploadDropzone";
import PhotoGrid from "./PhotoGrid";
import PhotoLightbox from "./PhotoLightbox";
import { usePhotos, useUploadPhoto, useDeletePhoto, useSetCoverPhoto } from "../../hooks/usePhotos";
import { toast } from "../../stores/toastStore";

export default function PhotosTab({ albumId }) {
  const { data: photos = [], isLoading, refetch } = usePhotos(albumId);
  const uploadMutation = useUploadPhoto(albumId);
  const deleteMutation = useDeletePhoto(albumId);
  const setCoverMutation = useSetCoverPhoto(albumId);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  const selectionMode = selectedIds.size > 0;

  async function handleFiles(files) {
    const newItems = files.map((file) => ({
      id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      file,
      status: "uploading",
      progress: 0,
    }));
    setUploadQueue((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      try {
        // Simulate progress
        setUploadQueue((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, progress: 50 } : u))
        );
        await uploadMutation.mutateAsync(item.file);
        setUploadQueue((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: "completed", progress: 100 } : u))
        );
      } catch {
        setUploadQueue((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: "failed" } : u))
        );
      }
    }

    // Clean up completed items after 2 seconds
    setTimeout(() => {
      setUploadQueue((prev) => prev.filter((u) => u.status !== "completed"));
    }, 2000);

    refetch();
  }

  function handleDrop(acceptedFiles) {
    handleFiles(acceptedFiles);
  }

  function toggleSelect(photoId) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleBulkDelete() {
    const photosToDelete = photos.filter((p) => selectedIds.has(p.id));
    setDeleteConfirm({ photos: photosToDelete, bulk: true });
  }

  async function confirmDelete() {
    if (!deleteConfirm) return;
    const { photos: targets } = deleteConfirm;
    for (const photo of targets) {
      try {
        await deleteMutation.mutateAsync(photo.id);
      } catch {
        toast.error(`Couldn't delete ${photo.filename}`);
      }
    }
    setDeleteConfirm(null);
    setSelectedIds(new Set());
  }

  function handleSetCover(photoId) {
    setCoverMutation.mutate(photoId);
  }

  function requestDelete(photo) {
    setDeleteConfirm({ photos: [photo], bulk: false });
  }

  function openLightbox(photo) {
    const idx = photos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx);
  }

  const uploading = uploadQueue.some((u) => u.status === "uploading");

  return (
    <div className="flex flex-col gap-6">
      <UploadDropzone onDrop={handleDrop} disabled={uploading} />

      {uploadQueue.length > 0 && (
        <div className="rounded-card border border-sand bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-charcoal">Uploading</h3>
          <div className="flex flex-col gap-2">
            {uploadQueue.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex-1 truncate text-sm text-charcoal">{item.file.name}</div>
                {item.status === "uploading" && <Spinner />}
                {item.status === "completed" && (
                  <Check size={16} className="text-success" aria-label="Completed" />
                )}
                {item.status === "failed" && (
                  <X size={16} className="text-error" aria-label="Failed" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectionMode && (
        <div className="sticky top-[72px] z-10 flex items-center justify-between gap-3 rounded-control border border-olive bg-olive/10 px-4 py-3">
          <p className="text-sm font-medium text-charcoal">
            {selectedIds.size} photo{selectedIds.size === 1 ? "" : "s"} selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <Trash2 size={14} aria-hidden="true" />
              Delete selected
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-control bg-sand/70" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <EmptyState
          icon={Images}
          title="No photos yet"
          description="Upload photos to this album using the drop zone above."
        />
      ) : (
        <PhotoGrid
          photos={photos}
          selectedIds={selectedIds}
          selectionMode={selectionMode}
          onToggleSelect={toggleSelect}
          onPhotoClick={openLightbox}
          onSetCover={handleSetCover}
          onDelete={requestDelete}
        />
      )}

      {lightboxIndex >= 0 && (
        <PhotoLightbox
          photos={photos}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(photos.length - 1, i + 1))}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
          title={deleteConfirm.bulk ? "Delete selected photos?" : "Delete this photo?"}
          description={
            deleteConfirm.bulk
              ? `${deleteConfirm.photos.length} photos will be permanently removed from the album.`
              : `"${deleteConfirm.photos[0].filename}" will be permanently removed.`
          }
          confirmLabel="Delete"
          danger
          loading={deleteMutation.isPending}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
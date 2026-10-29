import PhotoThumbnail from "./PhotoThumbnail";

export default function PhotoGrid({
  photos,
  selectedIds,
  selectionMode,
  onToggleSelect,
  onPhotoClick,
  onSetCover,
  onDelete,
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {photos.map((photo) => (
        <PhotoThumbnail
          key={photo.id}
          photo={photo}
          selected={selectedIds.has(photo.id)}
          selectionMode={selectionMode}
          onToggleSelect={onToggleSelect}
          onClick={onPhotoClick}
          onSetCover={onSetCover}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
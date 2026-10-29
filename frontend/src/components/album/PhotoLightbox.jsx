import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Download, Image as ImageIcon, X } from "lucide-react";
import IconButton from "../ui/IconButton";

export default function PhotoLightbox({ photos, activeIndex, onClose, onPrev, onNext }) {
  const photo = photos?.[activeIndex];

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") onPrev();
      else if (event.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!photo) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [photo, handleKeyDown]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/95 p-4"
      onClick={onClose}
    >
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <span className="rounded-full bg-charcoal/60 px-3 py-1.5 text-sm text-white/80">
          {activeIndex + 1} / {photos.length}
        </span>
        <a
          href={photo.url}
          download={photo.filename}
          aria-label="Download photo"
          className="rounded-full bg-charcoal/60 p-2 text-white/80 hover:bg-charcoal/80 hover:text-white"
        >
          <Download size={16} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="rounded-full bg-charcoal/60 p-2 text-white/80 hover:bg-charcoal/80 hover:text-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      {activeIndex > 0 && (
        <IconButton
          label="Previous photo"
          onClick={(event) => {
            event.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 bg-charcoal/60 text-white hover:bg-charcoal/80 hover:text-white"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </IconButton>
      )}

      {activeIndex < photos.length - 1 && (
        <IconButton
          label="Next photo"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 bg-charcoal/60 text-white hover:bg-charcoal/80 hover:text-white"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </IconButton>
      )}

      <img
        src={photo.url}
        alt={photo.filename}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ImageOff, X } from "lucide-react";
import { downloadPhoto } from "../../lib/downloads";

export default function ClientLightbox({
  photos,
  index,
  allowDownload,
  onClose,
  onPrev,
  onNext,
}) {
  const photo = photos[index];
  const dialogRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const touchStartX = useRef(null);

  // Reset per-image state whenever the shown photo changes.
  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [photo?.id]);

  // Keyboard + scroll lock + focus management.
  useEffect(() => {
    if (!photo) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [photo, onClose, onPrev, onNext]);

  if (!photo) return null;

  function handleTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) onPrev();
    else if (dx < -50) onNext();
    touchStartX.current = null;
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
      tabIndex={-1}
      className="fixed inset-0 z-[200] flex flex-col bg-charcoal/97 outline-none"
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white/85">
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm tabular-nums">
          {index + 1} of {photos.length}
        </span>
        <div className="flex items-center gap-1">
          {allowDownload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                downloadPhoto(photo);
              }}
              aria-label="Download this photo"
              className="rounded-full p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Download size={18} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close viewer"
            className="rounded-full p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative flex flex-1 items-center justify-center px-2 pb-2">
        {index > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:left-4"
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
        )}

        <div className="relative flex h-full w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {!loaded && !failed && <div className="h-40 w-40 animate-pulse rounded-card bg-white/10" aria-hidden="true" />}
          {failed ? (
            <div className="flex flex-col items-center gap-2 text-white/60">
              <ImageOff size={28} aria-hidden="true" />
              <p className="text-sm">This photo couldn't be loaded.</p>
            </div>
          ) : (
            <img
              src={photo.url}
              alt={photo.filename}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={cnImg(loaded)}
            />
          )}
        </div>

        {index < photos.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-4"
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Caption */}
      <p className="px-4 pb-4 text-center text-[13px] text-white/55">{photo.filename}</p>
    </div>
  );
}

function cnImg(loaded) {
  return `max-h-full max-w-full object-contain transition-opacity duration-300 ${
    loaded ? "opacity-100" : "opacity-0"
  }`;
}
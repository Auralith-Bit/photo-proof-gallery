import { useState } from "react";
import { Check, ImageOff } from "lucide-react";
import { cn } from "../../lib/utils";

function Tile({ photo, index, selectionMode, selected, onToggle, onOpen }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (selectionMode ? onToggle(index) : onOpen(index))}
        aria-label={selectionMode ? `Select ${photo.filename}` : `Open ${photo.filename}`}
        className={cn(
          "block aspect-[4/3] w-full overflow-hidden rounded-control bg-sand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
          selected && "ring-2 ring-olive"
        )}
      >
        {failed ? (
          <span className="flex h-full w-full items-center justify-center text-charcoal/30">
            <ImageOff size={20} aria-hidden="true" />
          </span>
        ) : (
          <img
            src={photo.thumbnailUrl}
            alt={photo.filename}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-opacity hover:opacity-90"
          />
        )}
      </button>

      {selectionMode && (
        <button
          type="button"
          onClick={() => onToggle(index)}
          aria-label={selected ? "Deselect photo" : "Select photo"}
          aria-pressed={selected}
          className={cn(
            "absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive",
            selected ? "border-olive bg-olive text-white" : "border-white/90 bg-white/70 text-transparent hover:border-olive"
          )}
        >
          <Check size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default function ClientGalleryGrid({ photos, selectionMode, selected, onToggle, onOpen }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((photo, index) => (
        <Tile
          key={photo.id}
          photo={photo}
          index={index}
          selectionMode={selectionMode}
          selected={selected.has(index)}
          onToggle={onToggle}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
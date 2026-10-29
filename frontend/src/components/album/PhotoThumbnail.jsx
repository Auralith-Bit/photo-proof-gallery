import { useState } from "react";
import { Check, Image as ImageIcon, MoreVertical, Star, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuItem } from "../ui/DropdownMenu";
import { cn } from "../../lib/utils";

export default function PhotoThumbnail({
  photo,
  selected,
  selectionMode,
  onToggleSelect,
  onClick,
  onSetCover,
  onDelete,
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-control bg-sand/60",
        !selectionMode && "cursor-pointer",
        selected && "ring-2 ring-olive"
      )}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center text-charcoal/30">
          <ImageIcon size={20} aria-hidden="true" />
        </div>
      ) : (
        <img
          src={photo.thumbnailUrl}
          alt={photo.filename}
          loading="lazy"
          onError={() => setFailed(true)}
          onClick={selectionMode ? () => onToggleSelect(photo.id) : () => onClick(photo)}
          className="h-full w-full object-cover transition-opacity hover:opacity-90"
        />
      )}

      {selectionMode && (
        <button
          type="button"
          onClick={() => onToggleSelect(photo.id)}
          aria-label={selected ? "Deselect photo" : "Select photo"}
          className={cn(
            "absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
            selected
              ? "border-olive bg-olive text-white"
              : "border-white/80 bg-white/60 text-transparent hover:border-olive hover:bg-white"
          )}
        >
          <Check size={14} aria-hidden="true" />
        </button>
      )}

      {photo.isCover && !selectionMode && (
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-charcoal/90 px-2 py-0.5 text-xs font-medium text-white">
          <Star size={10} aria-hidden="true" />
          Cover
        </div>
      )}

      {!selectionMode && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <DropdownMenu
            align="end"
            trigger={
              <button
                type="button"
                aria-label={`Actions for ${photo.filename}`}
                className="flex h-7 w-7 items-center justify-center rounded-md bg-charcoal/80 text-white hover:bg-charcoal"
              >
                <MoreVertical size={14} aria-hidden="true" />
              </button>
            }
          >
            <DropdownMenuItem onSelect={() => onSetCover(photo.id)} disabled={photo.isCover}>
              <Star size={14} aria-hidden="true" />
              {photo.isCover ? "Current cover" : "Set as cover"}
            </DropdownMenuItem>
            <DropdownMenuItem danger onSelect={() => onDelete(photo)}>
              <Trash2 size={14} aria-hidden="true" />
              Delete photo
            </DropdownMenuItem>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
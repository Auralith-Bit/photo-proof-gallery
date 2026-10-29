import { useState } from "react";
import { Images } from "lucide-react";
import Badge from "../ui/Badge";
import AlbumActionsMenu from "./AlbumActionsMenu";
import { albumStatusMap, formatDate, formatRelativeTime } from "../../lib/formatters";

export default function AlbumListItem({ album }) {
  const [imageFailed, setImageFailed] = useState(false);
  const status = albumStatusMap[album.status] ?? albumStatusMap.active;

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-control bg-sand/60">
        {album.coverPhotoUrl && !imageFailed ? (
          <img
            src={album.coverPhotoUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal/30">
            <Images size={16} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-charcoal">{album.title}</p>
        <p className="truncate text-[13px] text-charcoal/60">
          {album.clientName ?? "No client assigned"}
        </p>
      </div>

      <p className="hidden w-28 shrink-0 text-[13px] text-charcoal/60 md:block">
        {formatDate(album.eventDate)}
      </p>
      <p className="hidden w-20 shrink-0 text-[13px] text-charcoal/60 sm:block">
        {album.photoCount} photos
      </p>
      <div className="hidden w-24 shrink-0 sm:block">
        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
      <p className="hidden w-36 shrink-0 text-[13px] text-charcoal/50 lg:block">
        Updated {formatRelativeTime(album.updatedAt)}
      </p>

      <AlbumActionsMenu album={album} variant="row" />
    </div>
  );
}
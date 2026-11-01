import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Images } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import AlbumActionsMenu from "./AlbumActionsMenu";
import { albumStatusMap, formatDate, formatRelativeTime } from "../../lib/formatters";

export default function AlbumCard({ album }) {
  const [imageFailed, setImageFailed] = useState(false);
  const status = albumStatusMap[album.status] ?? albumStatusMap.active;

  return (
    <Card
      padded={false}
      className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-subtle"
    >
      {/* Whole card is the link; the actions menu floats above it as a sibling. */}
      <Link
        to={`/albums/${album.id}`}
        aria-label={`Open ${album.title}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-inset"
      >
        <div className="relative aspect-[4/3] bg-sand/60">
          {album.coverPhotoUrl && !imageFailed ? (
            <img
              src={album.coverPhotoUrl}
              alt={`Cover of ${album.title}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-charcoal/30">
              <Images size={24} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold text-charcoal group-hover:text-olive">
              {album.title}
            </h3>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          <p className="truncate text-[13px] text-charcoal/60">
            {album.clientName ?? "No client assigned"}
          </p>
          <div className="flex items-center gap-3 text-[13px] text-charcoal/50">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} aria-hidden="true" />
              {formatDate(album.eventDate)}
            </span>
            <span className="flex items-center gap-1">
              <Images size={13} aria-hidden="true" />
              {album.photoCount}
            </span>
          </div>
          <p className="text-xs text-charcoal/40">Updated {formatRelativeTime(album.updatedAt)}</p>
        </div>
      </Link>

      {/* Sibling overlay — NOT inside the link, so its button stays valid. */}
      <div className="absolute right-2 top-2 z-10" onClick={(e) => e.stopPropagation()}>
        <AlbumActionsMenu album={album} variant="card" />
      </div>
    </Card>
  );
}
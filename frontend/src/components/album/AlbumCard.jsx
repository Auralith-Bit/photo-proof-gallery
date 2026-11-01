import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Images } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import AlbumActionsMenu from "./AlbumActionsMenu";
import { albumStatusMap, formatDate, formatRelativeTime } from "../../lib/formatters";

export default function AlbumCard({ album }) {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const status = albumStatusMap[album.status] ?? albumStatusMap.active;

  function handleOpen(e) {
    // If click originated inside the action menu button, don't navigate
    if (e.target.closest("[data-radix-dropdown-menu-trigger]") || e.target.closest("button")) {
      return;
    }
    navigate(`/albums/${album.id}`);
  }

  return (
    <Card
      padded={false}
      className="group cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-subtle"
      onClick={handleOpen}
    >
      <div className="relative aspect-[4/3] bg-sand/60">
        {album.coverPhotoUrl && !imageFailed ? (
          <img
            src={album.coverPhotoUrl}
            alt={`Cover of ${album.title}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal/30">
            <Images size={24} aria-hidden="true" />
          </div>
        )}
        <div className="absolute right-2 top-2" onClick={(e) => e.stopPropagation()}>
          <AlbumActionsMenu album={album} variant="card" />
        </div>
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
    </Card>
  );
}
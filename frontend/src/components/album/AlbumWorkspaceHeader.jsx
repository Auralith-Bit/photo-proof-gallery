import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, ExternalLink, Images, User } from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import { albumStatusMap, formatDate } from "../../lib/formatters";

export default function AlbumWorkspaceHeader({ album, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <header className="mb-6">
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-8 w-96 mb-3" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </header>
    );
  }

  if (!album) return null;
  const status = albumStatusMap[album.status] ?? albumStatusMap.active;

  return (
    <header className="mb-6">
      <button
        type="button"
        onClick={() => navigate("/albums")}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-charcoal/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60 rounded-control"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My Albums
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-[28px] font-semibold leading-9 text-charcoal">
              {album.title}
            </h1>
            <Badge tone={status.tone}>{status.label}</Badge>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-charcoal/60">
            <span className="flex items-center gap-1.5">
              <User size={13} aria-hidden="true" />
              {album.clientName ?? "Unassigned"}
            </span>
            {album.eventDate && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} aria-hidden="true" />
                {formatDate(album.eventDate)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Images size={13} aria-hidden="true" />
              {album.photoCount} photos
            </span>
          </div>
        </div>

        <Button variant="outline" onClick={() => navigate(`/a/${album.accessToken}/gallery`)}>
          <ExternalLink size={16} aria-hidden="true" />
          Preview Client Gallery
        </Button>
      </div>
    </header>
  );
}
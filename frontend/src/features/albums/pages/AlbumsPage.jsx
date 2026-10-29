import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Images, LayoutGrid, List, Plus, Search } from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import AlbumCard from "../../../components/album/AlbumCard";
import AlbumListItem from "../../../components/album/AlbumListItem";
import { useAlbums } from "../../../hooks/useAlbums";
import { cn } from "../../../lib/utils";

const filters = [
  { value: "all", label: "All Albums" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function GridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} padded={false} className="overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function AlbumsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [status, setStatus] = useState("all");
  const [view, setView] = useState(() => localStorage.getItem("frameora:albumsView") || "grid");
  const { data: albums, isLoading, isError, refetch } = useAlbums();

  function setQuery(value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }

  function changeView(next) {
    setView(next);
    localStorage.setItem("frameora:albumsView", next);
  }

  function clearFilters() {
    setQuery("");
    setStatus("all");
  }

  const filtered = useMemo(() => {
    let list = albums ?? [];
    if (status !== "all") list = list.filter((album) => album.status === status);
    const term = query.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (album) =>
          album.title.toLowerCase().includes(term) ||
          (album.clientName ?? "").toLowerCase().includes(term)
      );
    }
    return list;
  }, [albums, status, query]);

  const counts = useMemo(() => {
    const list = albums ?? [];
    return {
      all: list.length,
      active: list.filter((a) => a.status === "active").length,
      draft: list.filter((a) => a.status === "draft").length,
      archived: list.filter((a) => a.status === "archived").length,
    };
  }, [albums]);

  const filtersActive = status !== "all" || query !== "";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9 text-charcoal">My Albums</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {isLoading ? "Loading albums…" : `${counts.all} album${counts.all === 1 ? "" : "s"} in your studio`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or client…"
              aria-label="Search albums"
              className="h-10 w-56 rounded-control border border-sand bg-white pl-9 pr-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
            />
          </div>

          <div className="flex rounded-control border border-sand bg-white p-1" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => changeView("grid")}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              className={cn(
                "rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
                view === "grid" ? "bg-charcoal text-white" : "text-charcoal/60 hover:text-charcoal"
              )}
            >
              <LayoutGrid size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => changeView("list")}
              aria-pressed={view === "list"}
              aria-label="List view"
              className={cn(
                "rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
                view === "list" ? "bg-charcoal text-white" : "text-charcoal/60 hover:text-charcoal"
              )}
            >
              <List size={16} aria-hidden="true" />
            </button>
          </div>

          <Button onClick={() => navigate("/albums/new")}>
            <Plus size={16} aria-hidden="true" /> Create Album
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatus(filter.value)}
            aria-pressed={status === filter.value}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
              status === filter.value
                ? "border-olive bg-olive text-white"
                : "border-sand bg-white text-charcoal/70 hover:border-olive/50 hover:text-charcoal"
            )}
          >
            {filter.label}
            <span className="ml-1.5 opacity-70">{counts[filter.value]}</span>
          </button>
        ))}
        {filtersActive && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {isError ? (
        <ErrorState
          title="We couldn't load your albums"
          description="Something went wrong while fetching your albums."
          onRetry={() => refetch()}
        />
      ) : isLoading ? (
        <GridSkeleton />
      ) : counts.all === 0 ? (
        <EmptyState
          icon={Images}
          title="No albums yet"
          description="Create your first album to start organizing and sharing your client galleries."
        >
          <Button onClick={() => navigate("/albums/new")}>
            <Plus size={16} aria-hidden="true" /> Create Album
          </Button>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching albums"
          description="Try a different search term, or clear the active filters."
        >
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <Card padded={false} className="divide-y divide-sand">
          {filtered.map((album) => (
            <AlbumListItem key={album.id} album={album} />
          ))}
        </Card>
      )}
    </div>
  );
}
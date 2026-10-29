import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FolderOpen,
  HardDrive,
  Images,
  Plus,
  Upload,
  Users,
} from "lucide-react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";
import ErrorState from "../../../components/ui/ErrorState";
import MetricCard from "../../../components/ui/MetricCard";
import AlbumCard from "../../../components/album/AlbumCard";
import ActivityItem from "../../../components/workspace/ActivityItem";
import StorageCard from "../../../components/workspace/StorageCard";
import { useAlbums } from "../../../hooks/useAlbums";
import { useActivity } from "../../../hooks/useActivity";
import { useStorage } from "../../../hooks/useStorage";
import { useUser } from "../../../hooks/useUser";
import { formatBytes } from "../../../lib/formatters";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function AlbumCardSkeleton() {
  return (
    <Card padded={false} className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </Card>
  );
}

function QuickActions({ onNavigate }) {
  const actions = [
    { label: "Create Album", icon: Plus, to: "/albums/new" },
    { label: "Upload Photos", icon: Upload, to: "/uploads" },
    { label: "View All Albums", icon: Images, to: "/albums" },
    { label: "Manage Clients", icon: Users, to: "/clients" },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-charcoal">Quick Actions</h2>
      <div className="mt-3 flex flex-col gap-1">
        {actions.map(({ label, icon: Icon, to }) => (
          <button
            key={to}
            type="button"
            onClick={() => onNavigate(to)}
            className="flex items-center justify-between rounded-control px-3 py-2.5 text-sm font-medium text-charcoal hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
          >
            <span className="flex items-center gap-2.5">
              <Icon size={16} className="text-olive" aria-hidden="true" />
              {label}
            </span>
            <ArrowRight size={14} className="text-charcoal/40" aria-hidden="true" />
          </button>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const albumsQuery = useAlbums();
  const activityQuery = useActivity();
  const storageQuery = useStorage();

  const albums = albumsQuery.data ?? [];
  const totalPhotos = albums.reduce((sum, album) => sum + album.photoCount, 0);
  const activeAlbums = albums.filter((album) => album.status === "active").length;
  const recentAlbums = [...albums]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  const loading = albumsQuery.isLoading;
  const firstName = user?.name?.split(" ")[0];
  const storagePercent = storageQuery.data?.totalBytes
    ? Math.round((storageQuery.data.usedBytes / storageQuery.data.totalBytes) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9 text-charcoal">
            {getGreeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Here's what's happening across your studio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/albums/new")}>
            <Plus size={16} aria-hidden="true" /> Create Album
          </Button>
          <Button variant="outline" onClick={() => navigate("/uploads")}>
            <Upload size={16} aria-hidden="true" /> Upload Photos
          </Button>
        </div>
      </header>

      {albumsQuery.isError ? (
        <ErrorState
          title="We couldn't load your dashboard"
          description="Something went wrong while fetching your studio data."
          onRetry={() => albumsQuery.refetch()}
        />
      ) : (
        <>
          <section aria-label="Studio metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              loading={loading}
              icon={FolderOpen}
              label="Total Albums"
              value={albums.length}
              supporting={`${activeAlbums} active`}
            />
            <MetricCard
              loading={loading}
              icon={Images}
              label="Total Photos"
              value={totalPhotos}
              supporting="Across all albums"
            />
            <MetricCard
              loading={loading}
              icon={CheckCircle2}
              label="Active Albums"
              value={activeAlbums}
              supporting="Shared with clients"
            />
            <MetricCard
              loading={storageQuery.isLoading}
              icon={HardDrive}
              label="Storage Used"
              value={storageQuery.data ? formatBytes(storageQuery.data.usedBytes) : "—"}
              supporting={`${storagePercent}% of allowance`}
            />
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            <section aria-label="Recent albums" className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-charcoal">Recent Albums</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/albums")}>
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Button>
              </div>

              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AlbumCardSkeleton />
                  <AlbumCardSkeleton />
                  <AlbumCardSkeleton />
                </div>
              ) : recentAlbums.length === 0 ? (
                <EmptyState
                  icon={Images}
                  title="No albums yet"
                  description="Create your first album to start organizing and sharing your client galleries."
                >
                  <Button onClick={() => navigate("/albums/new")}>
                    <Plus size={16} aria-hidden="true" /> Create Album
                  </Button>
                </EmptyState>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentAlbums.map((album) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              )}
            </section>

            <aside className="flex flex-col gap-6">
              <StorageCard query={storageQuery} />
              <QuickActions onNavigate={navigate} />
              <Card>
                <h2 className="text-lg font-semibold text-charcoal">Recent Activity</h2>
                {activityQuery.isLoading ? (
                  <div className="mt-3 flex flex-col gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : activityQuery.isError ? (
                  <p className="mt-3 text-sm text-charcoal/60">
                    Activity is unavailable right now.
                  </p>
                ) : (activityQuery.data ?? []).length === 0 ? (
                  <p className="mt-3 text-sm text-charcoal/60">
                    No recent activity yet. Actions like uploads and shares will appear here.
                  </p>
                ) : (
                  <ul className="mt-2 divide-y divide-sand">
                    {activityQuery.data.map((item) => (
                      <ActivityItem key={item.id} activity={item} />
                    ))}
                  </ul>
                )}
              </Card>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
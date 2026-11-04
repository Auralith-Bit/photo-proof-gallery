import { useMemo, useState } from "react";
import {
  Activity,
  HardDrive,
  Images,
  Info,
  TrendingUp,
} from "lucide-react";
import Card from "../../../components/ui/Card";
import MetricCard from "../../../components/ui/MetricCard";
import Skeleton from "../../../components/ui/Skeleton";
import ErrorState from "../../../components/ui/ErrorState";
import InlineAlert from "../../../components/ui/InlineAlert";
import AnalyticsFilterBar from "../../../components/analytics/AnalyticsFilterBar";
import ChartCard from "../../../components/analytics/ChartCard";
import AlbumsCreatedChart from "../../../components/analytics/AlbumsCreatedChart";
import UploadActivityChart from "../../../components/analytics/UploadActivityChart";
import { useAnalytics } from "../../../hooks/useAnalytics";
import { useAlbums } from "../../../hooks/useAlbums";
import { useStorage } from "../../../hooks/useStorage";
import { resolveRange, formatRangeLabel } from "../../../lib/analytics";
import { formatBytes } from "../../../lib/formatters";

const todayISO = () => new Date().toISOString().slice(0, 10);
const monthAgoISO = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

export default function AnalyticsPage() {
  const [preset, setPreset] = useState("30");
  const [customFrom, setCustomFrom] = useState(monthAgoISO());
  const [customTo, setCustomTo] = useState(todayISO());

  const resolved = useMemo(
    () => resolveRange(preset, customFrom, customTo),
    [preset, customFrom, customTo]
  );

  const analyticsQuery = useAnalytics({
    preset,
    from: preset === "custom" ? customFrom : undefined,
    to: preset === "custom" ? customTo : undefined,
  });
  const albumsQuery = useAlbums();
  const storageQuery = useStorage();

  const buckets = analyticsQuery.data?.buckets ?? [];
  const totals = analyticsQuery.data?.totals ?? { albums: 0, photos: 0 };
  const loading = analyticsQuery.isLoading;
  const isEmpty = !loading && buckets.length > 0 && totals.albums === 0 && totals.photos === 0;

  const albums = albumsQuery.data ?? [];
  const activeAlbums = albums.filter((a) => a.status === "active").length;
  const storage = storageQuery.data;

  const rangeLabel = formatRangeLabel(resolved.start, resolved.end);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold leading-9 text-charcoal">Analytics</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            Studio activity over the selected period.
          </p>
        </div>
      </header>

      {/* Honesty banner: only shown if sample data is returned */}
      {analyticsQuery.data?.sample && (
        <InlineAlert tone="info">
          <span className="flex items-start gap-2">
            <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Sample data.</strong> The activity metrics and trends
              below are generated sample figures. Connect your backend to see live studio data.
            </span>
          </span>
        </InlineAlert>
      )}

      <AnalyticsFilterBar
        preset={preset}
        onPresetChange={setPreset}
        customFrom={customFrom}
        customTo={customTo}
        onCustomFromChange={setCustomFrom}
        onCustomToChange={setCustomTo}
        range={{ start: resolved.start.toISOString(), end: resolved.end.toISOString() }}
      />

      {/* Summary metrics — absolute counts only, no invented percentage deltas. */}
      <section aria-label="Summary metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          loading={loading}
          icon={TrendingUp}
          label="Albums created"
          value={totals.albums}
          supporting={rangeLabel}
        />
        <MetricCard
          loading={loading}
          icon={Images}
          label="Photos uploaded"
          value={totals.photos}
          supporting={rangeLabel}
        />
        <MetricCard
          loading={albumsQuery.isLoading}
          icon={Activity}
          label="Active albums"
          value={activeAlbums}
          supporting="Current snapshot"
        />
        <MetricCard
          loading={storageQuery.isLoading}
          icon={HardDrive}
          label="Storage used"
          value={storage ? formatBytes(storage.usedBytes) : "—"}
          supporting={
            storage ? `${Math.round((storage.usedBytes / storage.totalBytes) * 100)}% of allowance` : undefined
          }
        />
      </section>

      {analyticsQuery.isError ? (
        <ErrorState
          title="We couldn't load analytics"
          description="Something went wrong while computing your studio activity."
          onRetry={() => analyticsQuery.refetch()}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            title="Albums created over time"
            subtitle={`Grouped by ${resolved.granularity}`}
            loading={loading}
            isEmpty={isEmpty}
            error={false}
            summary={`In the period ${rangeLabel}, ${totals.albums} albums were created across ${buckets.length} ${resolved.granularity} buckets.`}
            legend={
              <span className="flex items-center gap-1.5 text-[13px] text-charcoal/60">
                <span className="h-2.5 w-2.5 rounded-sm bg-charcoal" aria-hidden="true" />
                Albums
              </span>
            }
          >
            <AlbumsCreatedChart buckets={buckets} />
          </ChartCard>

          <ChartCard
            title="Upload activity over time"
            subtitle={`Grouped by ${resolved.granularity}`}
            loading={loading}
            isEmpty={isEmpty}
            error={false}
            summary={`In the period ${rangeLabel}, ${totals.photos} photos were uploaded across ${buckets.length} ${resolved.granularity} buckets.`}
            legend={
              <span className="flex items-center gap-1.5 text-[13px] text-charcoal/60">
                <span className="h-2.5 w-2.5 rounded-sm bg-olive" aria-hidden="true" />
                Photos
              </span>
            }
          >
            <UploadActivityChart buckets={buckets} />
          </ChartCard>
        </div>
      )}
    </div>
  );
}
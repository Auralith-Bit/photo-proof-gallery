import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import ErrorState from "../ui/ErrorState";
import EmptyState from "../ui/EmptyState";
import { BarChart3 } from "lucide-react";

export default function ChartCard({
  title,
  subtitle,
  legend,
  loading,
  error,
  onRetry,
  isEmpty,
  emptyMessage = "No activity in this range.",
  summary,
  height = 280,
  children,
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-charcoal">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[13px] text-charcoal/60">{subtitle}</p>}
        </div>
        {legend && <div className="flex items-center gap-3">{legend}</div>}
      </div>

      {loading ? (
        <Skeleton style={{ height }} className="w-full rounded-control" />
      ) : error ? (
        <ErrorState
          title="We couldn't load this chart"
          description="Analytics are unavailable right now."
          onRetry={onRetry}
          className="border-0 bg-transparent py-6"
        />
      ) : isEmpty ? (
        <EmptyState
          icon={BarChart3}
          title="Nothing to show"
          description={emptyMessage}
          className="border-0 bg-transparent py-6"
        />
      ) : (
        <>
          {/* Screen-reader access to the underlying figures. */}
          {summary && <p className="sr-only">{summary}</p>}
          <div role="img" aria-label={summary || title} style={{ height }}>
            {children}
          </div>
        </>
      )}
    </Card>
  );
}
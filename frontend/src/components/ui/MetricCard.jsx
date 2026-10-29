import Card from "./Card";
import Skeleton from "./Skeleton";

export default function MetricCard({ icon: Icon, label, value, supporting, loading = false }) {
  return (
    <Card className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-ivory text-olive">
        <Icon size={18} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-charcoal/60">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-16" />
        ) : (
          <p className="mt-0.5 text-[28px] font-semibold leading-9 text-charcoal">{value}</p>
        )}
        {supporting && !loading && (
          <p className="mt-0.5 truncate text-[13px] text-charcoal/50">{supporting}</p>
        )}
      </div>
    </Card>
  );
}
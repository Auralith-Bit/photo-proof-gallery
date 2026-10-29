import { HardDrive } from "lucide-react";
import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";
import ProgressBar from "../ui/ProgressBar";
import { formatBytes } from "../../lib/formatters";

export default function StorageCard({ query }) {
  const { data, isLoading, isError } = query;
  const percent = data?.totalBytes ? Math.round((data.usedBytes / data.totalBytes) * 100) : 0;
  const remaining = data ? data.totalBytes - data.usedBytes : 0;

  return (
    <Card>
      <div className="flex items-center gap-2.5">
        <HardDrive size={16} className="text-olive" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-charcoal">Storage</h2>
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      ) : isError || !data ? (
        <p className="mt-3 text-sm text-charcoal/60">
          Storage information is unavailable right now.
        </p>
      ) : (
        <>
          <div className="mt-4">
            <ProgressBar value={percent} label="Storage used" />
          </div>
          <p className="mt-3 text-sm text-charcoal">
            <span className="font-semibold">{formatBytes(data.usedBytes)}</span>
            <span className="text-charcoal/60"> of {formatBytes(data.totalBytes)} used</span>
          </p>
          <p className="mt-0.5 text-[13px] text-charcoal/50">{formatBytes(remaining)} remaining</p>
          {percent >= 80 && (
            <p className="mt-3 rounded-control border border-warning/30 bg-warning/10 px-3 py-2 text-[13px] text-warning">
              You're approaching your storage limit.
            </p>
          )}
        </>
      )}
    </Card>
  );
}
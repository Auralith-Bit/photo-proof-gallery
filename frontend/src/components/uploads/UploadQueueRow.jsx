import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ImageOff,
  Loader2,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import ProgressBar from "../ui/ProgressBar";
import { cn } from "../../lib/utils";
import { formatBytes } from "../../lib/formatters";

const STATUS = {
  queued: { label: "Queued", icon: Clock, tone: "text-charcoal/60" },
  uploading: { label: "Uploading", icon: Loader2, tone: "text-olive", spin: true },
  processing: { label: "Processing", icon: Loader2, tone: "text-olive", spin: true },
  completed: { label: "Completed", icon: CheckCircle2, tone: "text-success" },
  failed: { label: "Failed", icon: AlertCircle, tone: "text-error" },
  cancelled: { label: "Cancelled", icon: XCircle, tone: "text-charcoal/50" },
  rejected: { label: "Rejected", icon: XCircle, tone: "text-error" },
};

export default function UploadQueueRow({ item, onCancel, onRetry, onRemove }) {
  const [thumbFailed, setThumbFailed] = useState(false);
  const meta = STATUS[item.status] ?? STATUS.queued;
  const Icon = meta.icon;
  const transferring = item.status === "uploading" || item.status === "processing";
  const removable = ["completed", "failed", "cancelled", "rejected"].includes(item.status);

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-control bg-sand/60">
        {item.previewUrl && !thumbFailed ? (
          <img
            src={item.previewUrl}
            alt=""
            onError={() => setThumbFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-charcoal/30">
            <ImageOff size={16} aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-charcoal">{item.name}</p>
          <span className={cn("flex shrink-0 items-center gap-1.5 text-[13px] font-medium", meta.tone)}>
            <Icon size={14} className={meta.spin ? "animate-spin" : undefined} aria-hidden="true" />
            {meta.label}
          </span>
        </div>

        <p className="mt-0.5 text-[13px] text-charcoal/50">{formatBytes(item.size)}</p>

        {transferring && (
          <div className="mt-2">
            <ProgressBar value={item.progress} label={`Uploading ${item.name}`} className="h-1.5" />
          </div>
        )}

        {item.error && (
          <p className="mt-1.5 text-[13px] text-error">{item.error}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {transferring && (
          <button
            type="button"
            onClick={() => onCancel(item.id)}
            aria-label={`Cancel upload of ${item.name}`}
            className="rounded-control p-2 text-charcoal/50 hover:bg-sand/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
        {item.status === "failed" && (
          <button
            type="button"
            onClick={() => onRetry(item.id)}
            aria-label={`Retry upload of ${item.name}`}
            className="rounded-control p-2 text-olive hover:bg-olive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
          >
            <RefreshCw size={16} aria-hidden="true" />
          </button>
        )}
        {removable && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from queue`}
            className="rounded-control p-2 text-charcoal/40 hover:bg-sand/60 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </li>
  );
}
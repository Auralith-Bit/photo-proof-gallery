import { CheckCheck, ListChecks, XCircle } from "lucide-react";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";
import UploadQueueRow from "./UploadQueueRow";
import { cn } from "../../lib/utils";

export default function UploadQueue({
  items,
  stats,
  active,
  overall,
  onCancelItem,
  onRetryItem,
  onRemoveItem,
  onCancelAll,
  onClearFinished,
}) {
  const hasFinished = stats.completed + stats.failed + stats.cancelled + stats.rejected > 0;

  return (
    <section aria-label="Upload queue" className="rounded-card border border-sand bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-sand px-4 py-3">
        <div className="flex items-center gap-2">
          <ListChecks size={16} className="text-olive" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-charcoal">Upload Queue</h2>
          {items.length > 0 && (
            <span className="rounded-full bg-ivory px-2 py-0.5 text-xs font-medium text-charcoal/60">
              {stats.completed}/{items.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {active > 0 && (
            <Button variant="ghost" size="sm" onClick={onCancelAll}>
              <XCircle size={14} aria-hidden="true" /> Cancel all
            </Button>
          )}
          {hasFinished && (
            <Button variant="ghost" size="sm" onClick={onClearFinished}>
              <CheckCheck size={14} aria-hidden="true" /> Clear finished
            </Button>
          )}
        </div>
      </header>

      {items.length > 0 && (
        <div className="border-b border-sand px-4 py-3" aria-live="polite">
          <div className="mb-1.5 flex items-center justify-between text-[13px] text-charcoal/60">
            <span>
              {active > 0 ? `${active} in progress` : "Batch complete"}
              {stats.failed > 0 && ` · ${stats.failed} failed`}
              {stats.rejected > 0 && ` · ${stats.rejected} rejected`}
            </span>
            <span className="font-medium text-charcoal">{overall}%</span>
          </div>
          <ProgressBar value={overall} label="Overall upload progress" />
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-1 px-4 py-10 text-center">
          <p className="text-sm font-medium text-charcoal">Your queue is empty</p>
          <p className="text-[13px] text-charcoal/50">
            Photos you add will appear here with live progress.
          </p>
        </div>
      ) : (
        <ul className={cn("divide-y divide-sand")}>
          {items.map((item) => (
            <UploadQueueRow
              key={item.id}
              item={item}
              onCancel={onCancelItem}
              onRetry={onRetryItem}
              onRemove={onRemoveItem}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
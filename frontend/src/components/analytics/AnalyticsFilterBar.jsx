import { RANGE_PRESETS, formatRangeLabel } from "../../lib/analytics";
import { cn } from "../../lib/utils";

export default function AnalyticsFilterBar({
  preset,
  onPresetChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  range,
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        role="group"
        aria-label="Date range"
        className="inline-flex flex-wrap gap-1 rounded-control border border-sand bg-white p-1"
      >
        {RANGE_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onPresetChange(p.value)}
            aria-pressed={preset === p.value}
            className={cn(
              "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive/60",
              preset === p.value
                ? "bg-charcoal text-white"
                : "text-charcoal/60 hover:text-charcoal"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-[13px] font-medium text-charcoal">
            From
            <input
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(e) => onCustomFromChange(e.target.value)}
              className="h-10 rounded-control border border-sand bg-white px-3 text-sm text-charcoal focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
            />
          </label>
          <label className="flex flex-col gap-1 text-[13px] font-medium text-charcoal">
            To
            <input
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={(e) => onCustomToChange(e.target.value)}
              className="h-10 rounded-control border border-sand bg-white px-3 text-sm text-charcoal focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25"
            />
          </label>
        </div>
      )}

      {range && (
        <p className="text-[13px] text-charcoal/50">
          Showing {formatRangeLabel(new Date(range.start), new Date(range.end))}
        </p>
      )}
    </div>
  );
}
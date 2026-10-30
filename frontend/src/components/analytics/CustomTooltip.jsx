export default function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-control border border-sand bg-white px-3 py-2 shadow-elevated">
      <p className="mb-1 text-xs font-medium text-charcoal/60">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-2 text-sm text-charcoal">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
            aria-hidden="true"
          />
          <span className="capitalize">{entry.name}:</span>
          <span className="font-semibold">
            {entry.value} {unit}
          </span>
        </p>
      ))}
    </div>
  );
}
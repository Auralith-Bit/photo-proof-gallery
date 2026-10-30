import {
  eachDayOfInterval,
  format,
  startOfDay,
  endOfDay,
  differenceInCalendarDays,
  subDays,
  parseISO,
  isValid,
} from "date-fns";

export const RANGE_PRESETS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "custom", label: "Custom" },
];

// Deterministic 0..1 pseudo-random so the sample series is stable per render.
function rand(n) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function granularityFor(days) {
  if (days <= 10) return "day";
  if (days <= 120) return "week";
  return "month";
}

export function formatRangeLabel(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = format(start, sameYear ? "MMM d" : "MMM d, yyyy");
  const endStr = format(end, "MMM d, yyyy");
  return `${startStr} – ${endStr}`;
}

/**
 * Resolve a preset or custom range into concrete start/end dates.
 * Custom input is sanitized: invalid or reversed ranges fall back to 30 days,
 * and the end date is clamped to today so we never chart the future.
 */
export function resolveRange(preset, customFrom, customTo) {
  const today = endOfDay(new Date());

  if (preset !== "custom") {
    const days = Number(preset) || 30;
    const start = startOfDay(subDays(today, days - 1));
    return { start, end: today, days, granularity: granularityFor(days) };
  }

  const from = parseISO(customFrom);
  const to = parseISO(customTo);
  if (!isValid(from) || !isValid(to) || from > to) {
    const start = startOfDay(subDays(today, 29));
    return { start, end: today, days: 30, granularity: "week" };
  }
  const start = startOfDay(from);
  const end = to > today ? today : endOfDay(to);
  const days = Math.max(1, differenceInCalendarDays(end, start) + 1);
  return { start, end, days, granularity: granularityFor(days) };
}

function bucketLabel(granularity, day) {
  if (granularity === "day") return format(day, "MMM d");
  if (granularity === "week") return format(day, "'W/' MMM d");
  return format(day, "MMM ''yy");
}

/**
 * Build per-bucket sample counts. Values are derived deterministically from the
 * day index — they are SAMPLE data (flagged by the service), not telemetry.
 */
export function buildBuckets({ start, end, granularity }) {
  const days = eachDayOfInterval({ start, end });

  const daily = days.map((day, i) => {
    const dow = day.getDay();
    const weekendBoost = dow === 0 || dow === 6 ? 1.4 : 1; // studios busier on weekends
    const albums = Math.round(rand((i + 1) * 13.7) * 3); // 0..3
    const photos = Math.round((2 + rand((i + 1) * 7.3) * 24) * weekendBoost); // ~2..36
    return { day, albums, photos };
  });

  if (granularity === "day") {
    return daily.map((d) => ({
      label: bucketLabel("day", d.day),
      albums: d.albums,
      photos: d.photos,
    }));
  }

  // Aggregate into week / month chunks.
  const chunks = [];
  let current = null;
  for (const d of daily) {
    const key =
      granularity === "week"
        ? `${d.day.getFullYear()}-W${format(d.day, "II")}`
        : `${d.day.getFullYear()}-${format(d.day, "MM")}`;
    if (!current || current.key !== key) {
      current = { key, label: bucketLabel(granularity, d.day), albums: 0, photos: 0 };
      chunks.push(current);
    }
    current.albums += d.albums;
    current.photos += d.photos;
  }
  return chunks;
}

export function summarize(buckets) {
  return buckets.reduce(
    (acc, b) => ({ albums: acc.albums + b.albums, photos: acc.photos + b.photos }),
    { albums: 0, photos: 0 }
  );
}
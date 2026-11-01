import { api } from "../lib/api";
import { buildBuckets, resolveRange, summarize } from "../lib/analytics";

export async function getAnalytics({ preset, from, to }) {
  try {
    const params = new URLSearchParams();
    if (preset) params.set("preset", preset);
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    const data = await api.get(`/analytics?${params.toString()}`);
    return data;
  } catch (err) {
    // Graceful fallback if backend is unreachable
    console.warn("Analytics backend query error, falling back to local calculation:", err);
    const range = resolveRange(preset, from, to);
    const buckets = buildBuckets(range);
    const totals = summarize(buckets);
    return {
      sample: true,
      range: {
        start: range.start.toISOString(),
        end: range.end.toISOString(),
        days: range.days,
        granularity: range.granularity,
      },
      buckets,
      totals,
    };
  }
}
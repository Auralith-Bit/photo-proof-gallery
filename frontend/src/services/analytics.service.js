import { buildBuckets, resolveRange, summarize } from "../lib/analytics";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns a SAMPLE analytics payload. `sample: true` is surfaced to the UI so the
 * page can clearly label these figures as demonstration data until the MERN
 * backend supplies real aggregates. Visit / download / storage-history metrics are
 * intentionally NOT returned here because the system does not track them.
 */
export async function getAnalytics({ preset, from, to }) {
  await delay();
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
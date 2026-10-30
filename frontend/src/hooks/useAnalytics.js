import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../services/analytics.service";

export function useAnalytics({ preset, from, to }) {
  return useQuery({
    queryKey: ["analytics", preset, from ?? null, to ?? null],
    queryFn: () => getAnalytics({ preset, from, to }),
  });
}
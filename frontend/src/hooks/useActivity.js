import { useQuery } from "@tanstack/react-query";
import { getRecentActivity } from "../services/activity.service";

export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: getRecentActivity,
  });
}
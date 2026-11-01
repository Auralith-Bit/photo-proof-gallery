import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { getCurrentUser } from "../services/auth.service";

// Returns the authenticated user — falls back to server fetch if auth store is empty.
export function useUser() {
  const { user: authUser } = useAuth();

  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    // Use whatever is already in the auth store as initialData so there's no flicker.
    initialData: authUser ?? undefined,
    enabled: !authUser, // only fetch when the store is empty
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
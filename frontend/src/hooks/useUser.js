import { useAuth } from "./useAuth";

// The current user IS the authenticated session — no separate request needed.
// Returns the same { data } shape the Dashboard already consumes.
export function useUser() {
  const { user } = useAuth();
  return { data: user, isLoading: false, isError: false };
}
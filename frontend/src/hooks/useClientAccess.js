import { useQuery } from "@tanstack/react-query";
import { resolveAlbumByToken } from "../services/client-access.service";

// Metadata-only lookup for the password page. No retries (a bad token should
// fail fast into the designed "invalid link" state, not hammer the gate).
export function useResolveAlbum(token) {
  return useQuery({
    queryKey: ["client-album", token],
    queryFn: () => resolveAlbumByToken(token),
    enabled: !!token,
    staleTime: Infinity,
    retry: false,
  });
}
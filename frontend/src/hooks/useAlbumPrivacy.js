import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  setAccessEnabled,
  setDownloadPermission,
  setAlbumPassword,
  removeAlbumPassword,
  regenerateAlbumLink,
} from "../services/album.service";
import { toast } from "../stores/toastStore";

function usePrivacyMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (album) => {
      if (successMessage) toast.success(successMessage(album));
      queryClient.invalidateQueries({ queryKey: ["album", album.id] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
  });
}

export function useSetAccessEnabled() {
  return usePrivacyMutation(
    ({ albumId, enabled }) => setAccessEnabled(albumId, enabled),
    (album) => (album.accessEnabled ? "Gallery access enabled." : "Gallery access disabled.")
  );
}

export function useSetDownloadPermission() {
  return usePrivacyMutation(
    ({ albumId, allow }) => setDownloadPermission(albumId, allow),
    (album) => (album.allowDownload ? "Downloads allowed." : "Downloads disabled.")
  );
}

export function useSetAlbumPassword() {
  return usePrivacyMutation(
    ({ albumId, password }) => setAlbumPassword(albumId, password),
    () => "Album password saved."
  );
}

export function useRemoveAlbumPassword() {
  return usePrivacyMutation(removeAlbumPassword, () => "Album password removed.");
}

export function useRegenerateAlbumLink() {
  return usePrivacyMutation(regenerateAlbumLink, () => "A new album link and QR code were generated.");
}
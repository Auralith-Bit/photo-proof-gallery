import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAlbums,
  getAlbumById,
  archiveAlbum,
  restoreAlbum,
  deleteAlbum,
  createAlbum,
  updateAlbum,
} from "../services/album.service";
import { toast } from "../stores/toastStore";

export function useAlbums() {
  return useQuery({ queryKey: ["albums"], queryFn: getAlbums });
}

export function useAlbum(albumId) {
  return useQuery({
    queryKey: ["album", albumId],
    queryFn: () => getAlbumById(albumId),
    enabled: !!albumId,
  });
}

function useAlbumMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (album) => {
      toast.success(successMessage(album));
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
}

export function useArchiveAlbum() {
  return useAlbumMutation(archiveAlbum, (album) => `"${album.title}" was archived.`);
}

export function useRestoreAlbum() {
  return useAlbumMutation(restoreAlbum, (album) => `"${album.title}" was restored.`);
}

export function useDeleteAlbum() {
  return useAlbumMutation(deleteAlbum, (album) => `"${album.title}" was deleted.`);
}

export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAlbum,
    onSuccess: (album) => {
      toast.success(`"${album.title}" created successfully.`);
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Couldn't create the album. Please try again.");
    },
  });
}

export function useUpdateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ albumId, data }) => updateAlbum(albumId, data),
    onSuccess: (album) => {
      toast.success("Album details saved.");
      queryClient.invalidateQueries({ queryKey: ["album", album.id] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Couldn't save album details. Please try again.");
    },
  });
}
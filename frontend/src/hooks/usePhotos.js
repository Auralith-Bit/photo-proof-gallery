import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPhotosByAlbum,
  uploadPhoto,
  deletePhoto,
  setCoverPhoto,
} from "../services/photo.service";
import { toast } from "../stores/toastStore";

export function usePhotos(albumId) {
  return useQuery({
    queryKey: ["photos", albumId],
    queryFn: () => getPhotosByAlbum(albumId),
    enabled: !!albumId,
  });
}

export function useUploadPhoto(albumId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => uploadPhoto(albumId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos", albumId] });
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: () => {
      toast.error("Some photos failed to upload. Please try again.");
    },
  });
}

export function useDeletePhoto(albumId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId) => deletePhoto(albumId, photoId),
    onSuccess: () => {
      toast.success("Photo deleted.");
      queryClient.invalidateQueries({ queryKey: ["photos", albumId] });
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: () => {
      toast.error("Couldn't delete the photo.");
    },
  });
}

export function useSetCoverPhoto(albumId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId) => setCoverPhoto(albumId, photoId),
    onSuccess: (photo) => {
      toast.success(`"${photo.filename}" is now the album cover.`);
      queryClient.invalidateQueries({ queryKey: ["photos", albumId] });
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: () => {
      toast.error("Couldn't set the cover photo.");
    },
  });
}
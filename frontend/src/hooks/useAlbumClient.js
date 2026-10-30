import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAlbum } from "../services/album.service";
import { toast } from "../stores/toastStore";

export function useAssignClient(albumId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (clientId) => updateAlbum(albumId, { clientId }),
    onSuccess: () => {
      toast.success("Client assignment updated.");
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => toast.error("Couldn't update the client assignment."),
  });
}

export function useUnassignClient(albumId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => updateAlbum(albumId, { clientId: "" }),
    onSuccess: () => {
      toast.success("Client unassigned from this album.");
      queryClient.invalidateQueries({ queryKey: ["album", albumId] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => toast.error("Couldn't unassign the client."),
  });
}
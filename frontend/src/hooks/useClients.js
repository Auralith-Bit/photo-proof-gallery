import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getClients,
  getClientById,
  createClient,
  updateClient,
  archiveClient,
  restoreClient,
  deleteClient,
} from "../services/client.service";
import { toast } from "../stores/toastStore";

export function useClients() {
  return useQuery({ queryKey: ["clients"], queryFn: getClients });
}

export function useClient(clientId) {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
  });
}

function useClientMutation(mutationFn, successMessage, extraInvalidate = []) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (client) => {
      if (successMessage) toast.success(successMessage(client));
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (client?.id) queryClient.invalidateQueries({ queryKey: ["client", client.id] });
      extraInvalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });
}

export function useCreateClient() {
  return useClientMutation(createClient, (c) => `${c.fullName} added to your clients.`);
}

export function useUpdateClient() {
  return useClientMutation(updateClient, () => "Client details saved.");
}

export function useArchiveClient() {
  return useClientMutation(archiveClient, (c) => `${c.fullName} was archived.`);
}

export function useRestoreClient() {
  return useClientMutation(restoreClient, (c) => `${c.fullName} was restored.`);
}

export function useDeleteClient() {
  // Deleting a client unassigns their albums, so the albums lists must refresh too.
  return useClientMutation(deleteClient, (c) => `${c.fullName} was deleted.`, [["albums"]]);
}
import { useQuery } from "@tanstack/react-query";
import { getStorageInfo } from "../services/storage.service";

export function useStorage() {
  return useQuery({
    queryKey: ["storage"],
    queryFn: getStorageInfo,
  });
}
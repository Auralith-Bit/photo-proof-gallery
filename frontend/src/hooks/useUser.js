import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user.service";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
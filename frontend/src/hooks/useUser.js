import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/user.service";

export function useUser() {
  return useQuery({ queryKey: ["user"], queryFn: getUser });
}
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const signIn = useAuthStore((s) => s.signIn);
  const signOut = useAuthStore((s) => s.signOut);
  const updateUser = useAuthStore((s) => s.updateUser);
  return {
    user,
    status,
    isAuthenticated: status === "authenticated",
    signIn,
    signOut,
    updateUser,
  };
}
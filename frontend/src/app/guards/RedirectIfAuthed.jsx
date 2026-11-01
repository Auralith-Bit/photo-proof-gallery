import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Wraps the auth pages. An already-signed-in photographer never sees login/register.
export default function RedirectIfAuthed({ children }) {
  const { status } = useAuth();
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;
  return children;
}
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Wraps the photographer workspace. Unauthenticated visitors are sent to /login,
// remembering where they came from so login can return them there.
export default function RequireAuth({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
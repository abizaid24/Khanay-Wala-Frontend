import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenSpinner } from "../components/ui/Spinner";

/**
 * Guards a route subtree. Pass `roles` (array of app.constants.ROLES values)
 * to restrict further — e.g. <ProtectedRoute roles={[ROLES.ADMIN]} />.
 * Without `roles`, any authenticated user may pass.
 */
export function ProtectedRoute({ roles }) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

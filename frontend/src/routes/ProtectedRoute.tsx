import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({
  allowedRole,
}: {
  allowedRole?: "candidate" | "employer" | "admin";
}) {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth to resolve fully
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading session…
      </div>
    );
  }

  // 🚫 No user at all → go to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Role mismatch → send to proper dashboard instead of landing
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") return <Navigate to="/app/admin" replace />;
    if (user.role === "employer")
      return <Navigate to="/app/employer" replace />;
    return <Navigate to="/app/dashboard" replace />;
  }

  // ✅ Authorized → render child routes
  return <Outlet />;
}

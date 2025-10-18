// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({
  allowedRole,
}: {
  allowedRole?: "candidate" | "employer" | "admin";
}) {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-8">Loading session…</p>;
  if (!user) return <Navigate to="/auth" replace />;

  console.log("Current role:", user.role, "Allowed:", allowedRole);
  if (allowedRole && user.role !== allowedRole)
    return <Navigate to="/" replace />;

  return <Outlet />;
}

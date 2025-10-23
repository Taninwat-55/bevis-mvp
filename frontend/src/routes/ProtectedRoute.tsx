// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  allowedRole?: "candidate" | "employer" | "admin";
  children?: ReactNode;
}

export default function ProtectedRoute({
  allowedRole,
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // ⏳ Wait for auth to resolve
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading session…
      </div>
    );
  }

  // 🚫 No user → redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔒 Wrong role → redirect to their own dashboard
  if (allowedRole && user.role !== allowedRole) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "employer") return <Navigate to="/employer" replace />;
    return <Navigate to="/candidate/dashboard" replace />;
  }

  // ✅ Authorized → render either children or nested routes
  return <>{children || <Outlet />}</>;
}

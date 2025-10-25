// src/layout/AdminLayout.tsx
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto bg-[var(--color-surface)]">
        <Outlet />
      </main>
    </div>
  );
}

// src/components/layout/EmployerLayout.tsx
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function EmployerLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

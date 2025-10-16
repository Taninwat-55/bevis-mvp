import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar accentColor="var(--color-candidate-dark)" />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

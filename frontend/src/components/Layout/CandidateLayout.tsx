import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  const candidateLinks = [
    { to: "/dashboard", label: "🏠 Dashboard" },
    { to: "/jobs", label: "💼 Jobs" },
    { to: "/proofs", label: "📜 My Proofs" },
    { to: "/profile", label: "👤 Profile" },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <Sidebar
        links={candidateLinks}
        accentColor="var(--color-candidate-dark)"
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

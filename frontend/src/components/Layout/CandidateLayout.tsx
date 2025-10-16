import { Outlet, NavLink } from "react-router-dom";

export default function CandidateLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* --- Sidebar --- */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <div className="p-6 text-xl font-semibold text-[var(--color-candidate-dark)]">
          Dashboard
        </div>
        <nav className="flex flex-col px-4 space-y-2">
          <SidebarLink to="/" label="🏠 Dashboard" />
          <SidebarLink to="/candidate/jobs" label="💼 Jobs" />
          <SidebarLink to="/candidate/proofs" label="📜 My Proofs" />
          <SidebarLink to="/candidate/profile" label="👤 Profile" />
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 rounded-[var(--radius-button)] font-medium transition ${
          isActive
            ? "bg-[var(--color-candidate-light)]/20 text-[var(--color-candidate-dark)]"
            : "text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)]"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

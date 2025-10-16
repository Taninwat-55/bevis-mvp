import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
} from "lucide-react";

interface SidebarProps {
  links?: { to: string; label: string; icon?: JSX.Element }[];
  accentColor?: string;
}

export default function Sidebar({
  links,
  accentColor = "var(--color-candidate-dark)",
}: SidebarProps) {
  // Default links for candidate flow
  const defaultLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    { to: "/jobs", label: "Jobs", icon: <Briefcase size={17} /> },
    { to: "/proofs", label: "My Proofs", icon: <FileText size={17} /> },
  ];

  const activeLinks = links || defaultLinks;

  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <nav className="flex flex-col p-5 space-y-2">
        {activeLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => {
              const base =
                "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] font-medium transition-colors duration-200";
              const active =
                "bg-[var(--color-candidate-light)]/20 text-[var(--color-candidate-dark)]";
              const inactive =
                "text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)]";
              return `${base} ${isActive ? active : inactive}`;
            }}
            style={({ isActive }) =>
              isActive ? { color: accentColor } : undefined
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

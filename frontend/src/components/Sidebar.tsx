// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  BarChart,
  Shield,
  FolderKanban,
  UserSquare2,
  PlusCircle,
  Database,
  Star,
  Settings,
  House,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  role?: "candidate" | "employer" | "admin";
}

/**
 * 🎨 Unified Sidebar — shared across all roles.
 * Reads `user.role` from AuthContext (or explicit prop).
 */
export default function Sidebar({ role }: SidebarProps) {
  const { user } = useAuth();

  const resolvedRole = role || user?.role || "candidate";

  // 🎨 Accent color per role
  const accentColorMap = {
    candidate: "var(--color-candidate-dark)",
    employer: "var(--color-employer-dark)",
    admin: "#4B5563",
  } as const;
  const accentColor = accentColorMap[resolvedRole];

  // 👩‍🎓 Candidate links
  const candidateLinks = [
    { to: "/home", label: "Home", icon: <House size={17} /> },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    { to: "/jobs", label: "Jobs", icon: <Briefcase size={17} /> },
    {
      to: "/proofs",
      label: "My Proofs",
      icon: <FileText size={17} />,
    },
    {
      to: "/profile",
      label: "Profile",
      icon: <UserSquare2 size={17} />,
    },
  ];

  // 🏢 Employer links
  const employerLinks = [
    { to: "/employer", label: "Home", icon: <House size={17} /> },
    {
      to: "/employer/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    { to: "/employer/jobs", label: "My Jobs", icon: <Briefcase size={17} /> },
    {
      to: "/employer/post",
      label: "Post a Job",
      icon: <PlusCircle size={17} />,
    },
    {
      to: "/employer/submissions",
      label: "Submissions",
      icon: <FolderKanban size={17} />,
    },
    { to: "/employer/talent", label: "Talent Pool", icon: <Users size={17} /> },
  ];

  // 🧩 Admin links
  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: <Shield size={17} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={17} /> },
    {
      to: "/admin/jobs",
      label: "Jobs Overview",
      icon: <Briefcase size={17} />,
    },
    {
      to: "/admin/data-viewer",
      label: "Data Viewer",
      icon: <Database size={17} />,
    },
    { to: "/admin/feedback", label: "Feedback Logs", icon: <Star size={17} /> },
    {
      to: "/admin/analytics",
      label: "Analytics",
      icon: <BarChart size={17} />,
    },
    { to: "/admin/settings", label: "Settings", icon: <Settings size={17} /> },
  ];

  const activeLinks =
    resolvedRole === "employer"
      ? employerLinks
      : resolvedRole === "admin"
      ? adminLinks
      : candidateLinks;

  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <div className="p-5 border-b border-[var(--color-border)] font-semibold text-[var(--color-text)]">
        {resolvedRole === "candidate"
          ? "🎓 Candidate"
          : resolvedRole === "employer"
          ? "🏢 Employer"
          : "🧩 Admin"}{" "}
        Panel
      </div>

      <nav className="flex flex-col p-4 space-y-1">
        {activeLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) => {
              const base =
                "flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] font-medium transition-colors duration-200";
              const active = "bg-[var(--color-bg-accent)] font-semibold";
              const inactive =
                "text-[var(--color-text-muted)] hover:text-[var(--color-text)]";
              return `${base} ${isActive ? active : inactive}`;
            }}
            style={({ isActive }) =>
              isActive
                ? { color: accentColor, borderLeft: `3px solid ${accentColor}` }
                : undefined
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

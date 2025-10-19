// src/components/Sidebar.tsx
import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface SidebarProps {
  role?: "candidate" | "employer" | "admin";
}

export default function Sidebar({ role }: SidebarProps) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false); // 👈 state to toggle collapse

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
    { to: "/app", label: "Home", icon: <House size={17} /> },
    {
      to: "/app/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    { to: "/app/jobs", label: "Jobs", icon: <Briefcase size={17} /> },
    { to: "/app/proofs", label: "My Proofs", icon: <FileText size={17} /> },
    { to: "/app/profile", label: "Profile", icon: <UserSquare2 size={17} /> },
  ];

  // 🏢 Employer links
  const employerLinks = [
    { to: "/app/employer", label: "Home", icon: <House size={17} /> },
    {
      to: "/app/employer/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    {
      to: "/app/employer/jobs",
      label: "My Jobs",
      icon: <Briefcase size={17} />,
    },
    {
      to: "/app/employer/jobs/new",
      label: "Post a Job",
      icon: <PlusCircle size={17} />,
    },
    {
      to: "/app/employer/submissions",
      label: "Submissions",
      icon: <FolderKanban size={17} />,
    },
    {
      to: "/app/employer/talent",
      label: "Talent Pool",
      icon: <Users size={17} />,
    },
  ];

  // 🧩 Admin links
  const adminLinks = [
    { to: "/app/admin", label: "Dashboard", icon: <Shield size={17} /> },
    { to: "/app/admin/users", label: "Users", icon: <Users size={17} /> },
    {
      to: "/app/admin/jobs",
      label: "Jobs Overview",
      icon: <Briefcase size={17} />,
    },
    {
      to: "/app/admin/data-viewer",
      label: "Data Viewer",
      icon: <Database size={17} />,
    },
    {
      to: "/app/admin/feedback",
      label: "Feedback Logs",
      icon: <Star size={17} />,
    },
    {
      to: "/app/admin/analytics",
      label: "Analytics",
      icon: <BarChart size={17} />,
    },
    {
      to: "/app/admin/settings",
      label: "Settings",
      icon: <Settings size={17} />,
    },
  ];

  const activeLinks =
    resolvedRole === "employer"
      ? employerLinks
      : resolvedRole === "admin"
      ? adminLinks
      : candidateLinks;

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-[var(--color-border)] shadow-[var(--shadow-soft)] transition-all duration-300 ${
        collapsed ? "w-20" : "w-55"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        {!collapsed && (
          <span className="font-semibold text-[var(--color-text)] whitespace-nowrap">
            {resolvedRole === "candidate"
              ? "🎓 Candidate"
              : resolvedRole === "employer"
              ? "🏢 Employer"
              : "🧩 Admin"}{" "}
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col p-3 space-y-1">
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
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

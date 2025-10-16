import { NavLink } from "react-router-dom";

interface SidebarProps {
  links: { to: string; label: string; color?: string }[];
  accentColor?: string;
  title?: string;
}

export default function Sidebar({
  links,
  accentColor = "var(--color-candidate-dark)",
  title = "Bevis",
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <div className="p-6 text-xl font-semibold" style={{ color: accentColor }}>
        {title}
      </div>

      <nav className="flex flex-col px-4 space-y-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) => {
              const base =
                "px-3 py-2 rounded-[var(--radius-button)] font-medium transition-colors duration-200";
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
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

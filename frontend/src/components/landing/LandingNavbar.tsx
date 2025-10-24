import { useState } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function LandingNavbar() {
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Find Jobs", to: "/jobs" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "For Employers", to: "/auth?role=employer" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-semibold text-[var(--color-text)] tracking-tight"
          >
            Bevis
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-muted)]">
            {links.map((l) =>
              l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  className="hover:text-[var(--color-text)] transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  className="hover:text-[var(--color-text)] transition-colors"
                >
                  {l.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={isDark ? "Light mode" : "Dark mode"}
              className="rounded-lg p-2 hover-bg-soft"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/auth"
              className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
            >
              Log in
            </Link>

            <Link
              to="/auth"
              className="text-sm rounded-[var(--radius-button)] bg-[var(--color-employer)] text-white px-4 py-2 hover:brightness-110 transition"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden rounded-lg p-2 text-[var(--color-text)]"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <nav className="flex flex-col px-6 py-4 text-sm">
            {links.map((l) =>
              l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="py-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  onClick={() => setOpen(false)}
                  className="py-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {l.label}
                </a>
              )
            )}

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="w-full rounded-[var(--radius-button)] bg-[var(--color-employer)] text-white px-4 py-2 text-center hover:brightness-110 transition"
              >
                Sign up
              </Link>
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="w-full text-[var(--color-text-muted)] text-center hover:text-[var(--color-text)] transition"
              >
                Log in
              </Link>
              <button
                onClick={() => {
                  toggleTheme();
                  setOpen(false);
                }}
                className="mx-auto mt-2 rounded-lg p-2 hover-bg-soft"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

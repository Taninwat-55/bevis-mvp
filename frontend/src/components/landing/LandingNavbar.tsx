import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const navLinks = [
    { label: "For Candidates", href: "#candidates" },
    { label: "For Employers", href: "#employers" },
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#proof-loop" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface)] transition-colors backdrop-blur-md border-b border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="w-full flex items-center justify-between gap-4">
          {/* LEFT — Logo */}
          <div className="flex-shrink-0">
            <h1
              onClick={() => navigate("/")}
              className="text-xl font-semibold text-[var(--color-candidate-dark)] cursor-pointer"
            >
              Bevis
            </h1>
          </div>

          {/* CENTER — Nav links */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-[var(--color-text-muted)] text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[var(--color-text)] transition"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* RIGHT — Theme toggle + auth buttons */}
          <div className="hidden md:flex flex-shrink-0 items-center justify-end gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-[var(--radius-button)] text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => navigate("/auth")}
              className="text-sm px-4 py-2 rounded-[var(--radius-button)] text-[var(--color-candidate-dark)] font-medium border border-[var(--color-candidate-dark)] hover:bg-[var(--color-candidate-dark)] hover:text-white transition"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="text-sm px-4 py-2 rounded-[var(--radius-button)] bg-[var(--color-employer-dark)] text-white font-medium hover:bg-[var(--color-employer)] transition"
            >
              Get Started
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[var(--color-candidate-dark)]"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface)] transition-colors border-t border-[var(--color-border)]">
          <nav className="flex flex-col p-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
              >
                {link.label}
              </a>
            ))}

            <hr className="border-[var(--color-border)] my-2" />

            {/* 🌗 Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition text-sm"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/auth");
              }}
              className="text-[var(--color-candidate-dark)] text-sm font-medium"
            >
              Log In
            </button>

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate("/auth");
              }}
              className="bg-[var(--color-employer-dark)] text-white text-sm py-2 rounded-[var(--radius-button)] font-medium"
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

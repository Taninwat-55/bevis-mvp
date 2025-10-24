import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  Bell,
  LogOut,
  UserCircle2,
  Settings,
  FileText,
  Shield,
} from "lucide-react";
import { notify } from "./ui/Notify";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut, user, setOverride } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const actualRole = JSON.parse(
    localStorage.getItem("bevis_user") || "{}"
  )?.role;
  const overrideRole = localStorage.getItem("overrideRole");
  const isAdmin = actualRole === "admin" || overrideRole === "admin";

  const handleLogout = async () => {
    await signOut();
    notify.success("👋 You’ve been logged out");
    navigate("/");
  };

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🌐 Public quick links (always visible)
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Find Jobs", to: "/jobs" },
    { label: "Leaderboard", to: "/leaderboard" },
  ];

  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-[var(--shadow-soft)] px-6 py-3 flex items-center justify-between relative z-20 transition-colors">
      {/* Left: Logo + Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[var(--color-candidate-dark)]"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h1
          className="text-lg font-semibold text-[var(--color-candidate-dark)] cursor-pointer"
          onClick={() => navigate("/")}
        >
          Bevis
        </h1>
      </div>

      {/* Center: Global Nav Links (Desktop only) */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-muted)]">
        {navLinks.map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="hover:text-[var(--color-text)] transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right: Icons + Profile */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button
          onClick={() => toast("No new notifications 📬")}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition"
        >
          <Bell size={20} />
        </button>

        <button
          onClick={toggleTheme}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition"
        >
          <UserCircle2 size={22} />
        </button>

        {/* Profile Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-10 right-0 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-[var(--radius-card)] py-2 transition-colors">
            <p className="px-4 py-2 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
              {user?.email}
            </p>

            <button
              onClick={() => {
                navigate("/candidate/profile");
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
            >
              <UserCircle2 size={16} /> My Profile
            </button>

            <button
              onClick={() => {
                navigate("/candidate/proofs");
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
            >
              <FileText size={16} /> My Proofs
            </button>

            <button
              onClick={() => {
                navigate("/candidate/settings");
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
            >
              <Settings size={16} /> Settings
            </button>

            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setOverride?.("admin");
                    navigate("/admin");
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
                >
                  <Shield size={16} /> Admin Dashboard
                </button>
              </>
            )}

            <div className="border-t border-[var(--color-border)] my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[color-mix(in srgb, var(--color-text-muted) 6%, transparent)] flex items-center gap-2"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] md:hidden shadow-lg z-50">
          <nav className="flex flex-col px-6 py-4 text-sm">
            {navLinks.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              className="mt-3 flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

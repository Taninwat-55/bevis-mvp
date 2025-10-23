import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Close dropdown when clicking outside
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
          onClick={() =>
            navigate(
              user?.role === "admin"
                ? "/admin"
                : user?.role === "employer"
                ? "/employer"
                : user?.role === "candidate"
                ? "/candidate"
                : "/"
            )
          }
        >
          Bevis
        </h1>
      </div>

      {/* Right: Icons + Profile Dropdown */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {localStorage.getItem("overrideRole") && (
          <span className="text-xs text-[var(--color-text-muted)] italic ml-2">
            (Viewing as {localStorage.getItem("overrideRole")})
          </span>
        )}

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

        {/* Profile Icon */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition"
        >
          <UserCircle2 size={22} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-10 right-0 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-[var(--radius-card)] py-2 transition-colors">
            <p className="px-4 py-2 text-xs text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
              {user?.email}
            </p>

            <button
              onClick={() => {
                navigate(
                  user?.role === "admin"
                    ? "/admin/settings"
                    : user?.role === "employer"
                    ? "/employer/settings"
                    : "/candidate/profile"
                );
                setDropdownOpen(false);
              }}
              className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
            >
              <UserCircle2 size={16} /> My Profile
            </button>

            <button
              onClick={() => {
                navigate(
                  user?.role === "candidate"
                    ? "/candidate/proofs"
                    : user?.role === "employer"
                    ? "/employer/submissions"
                    : "/admin/feedback"
                );
                setDropdownOpen(false);
              }}
              className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
            >
              <FileText size={16} /> My Proofs
            </button>

            <button
              onClick={() => {
                navigate(
                  user?.role === "admin"
                    ? "/admin/settings"
                    : user?.role === "employer"
                    ? "/employer/settings"
                    : "/candidate/settings"
                );
                setDropdownOpen(false);
              }}
              className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
            >
              <Settings size={16} /> Settings
            </button>

            {/* 🧩 Show only if admin */}
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    setOverride?.("candidate");
                    navigate("/candidate/dashboard", { replace: true });
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
                >
                  👩‍🎓 View as Candidate
                </button>
                <button
                  onClick={() => {
                    setOverride?.("employer");
                    navigate("/employer", { replace: true });
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
                >
                  🏢 View as Employer
                </button>
                <button
                  onClick={() => {
                    setOverride?.("admin");
                    navigate("/admin", { replace: true });
                    setDropdownOpen(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex items-center gap-2 hover-bg-soft transition-colors"
                >
                  <Shield size={16} /> Admin Dashboard
                </button>
              </>
            )}

            <div className="border-t border-[var(--color-border)] my-1" />

            <button
              onClick={handleLogout}
              className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[color-mix(in srgb, var(--color-text-muted) 6%, transparent)] flex items-center gap-2"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

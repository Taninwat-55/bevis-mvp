import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  Bell,
  LogOut,
  LayoutDashboard,
  UserCircle2,
  Settings,
  FileText,
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await signOut();
    toast.success("👋 You’ve been logged out");
    navigate("/auth");
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
    <header className="bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-soft)] px-6 py-3 flex items-center justify-between relative z-20">
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
          onClick={() => navigate("/dashboard")}
        >
          Bevis
        </h1>
      </div>

      {/* Center: Desktop Links */}

      {/* Right: Icons + Profile Dropdown */}
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button
          onClick={() => toast("No new notifications 📬")}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] transition"
        >
          <Bell size={20} />
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
          <div className="absolute top-10 right-0 w-44 bg-white border border-[var(--color-border)] shadow-lg rounded-[var(--radius-card)] py-2">
            <button
              onClick={() => {
                navigate("/profile");
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] flex items-center gap-2"
            >
              <UserCircle2 size={16} /> My Profile
            </button>

            <button
              onClick={() => toast("Settings coming soon ⚙️")}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] flex items-center gap-2"
            >
              <Settings size={16} /> Settings
            </button>

            <button
              onClick={() => {
                navigate("/proofs");
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] flex items-center gap-2"
            >
              <FileText size={16} /> My Proofs
            </button>

            <div className="border-t border-[var(--color-border)] my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-error)] hover:bg-[var(--color-bg)] flex items-center gap-2"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-[var(--color-border)] shadow-lg md:hidden z-10">
          <nav className="flex flex-col p-4 space-y-2">
            <button
              onClick={() => {
                navigate("/dashboard");
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 text-left text-[var(--color-text)] font-medium hover:text-[var(--color-candidate-dark)]"
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/profile");
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 text-left text-[var(--color-text)] font-medium hover:text-[var(--color-candidate-dark)]"
            >
              <UserCircle2 size={18} /> Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-left text-[var(--color-error)] font-medium hover:underline"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

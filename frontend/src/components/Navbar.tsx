import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("👋 You’ve been logged out");
    navigate("/auth");
  };

  return (
    <header className="bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-soft)] px-6 py-3 flex items-center justify-between relative">
      {/* Left: Logo + Mobile Toggle */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--color-candidate-dark)]"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <h1 className="text-lg font-semibold text-[var(--color-candidate-dark)]">
          Bevis
        </h1>
      </div>

      {/* Right: User info */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-[var(--color-text-muted)]">
          {user?.email}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-[var(--color-error)] hover:underline"
        >
          Log out
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full left-0 w-full bg-white border-t border-[var(--color-border)] shadow-lg md:hidden z-10">
          <nav className="flex flex-col p-4 space-y-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-left text-[var(--color-text)] font-medium hover:text-[var(--color-candidate-dark)]"
            >
              🏠 Dashboard
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="text-left text-[var(--color-text)] font-medium hover:text-[var(--color-candidate-dark)]"
            >
              💼 Jobs
            </button>
            <button
              onClick={() => navigate("/proofs")}
              className="text-left text-[var(--color-text)] font-medium hover:text-[var(--color-candidate-dark)]"
            >
              📜 My Proofs
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="text-left text-[var(--color-text)] font-medium hover:text-[var(--color-candidate-dark)]"
            >
              👤 Profile
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("👋 You’ve been logged out");
    navigate("/auth");
  };

  return (
    <header className="bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-soft)] px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-[var(--color-candidate-dark)]">
        Bevis
      </h1>
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
    </header>
  );
}

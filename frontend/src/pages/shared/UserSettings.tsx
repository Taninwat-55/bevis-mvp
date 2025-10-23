import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import BackButton from "@/components/ui/BackButton";
import toast from "react-hot-toast";

export default function UserSettings() {
  const { user, signOut } = useAuth();
  const [emailNotif, setEmailNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    toast.success("✅ Settings saved!");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      <header className="mb-8 flex flex-col gap-2">
        <BackButton to="/dashboard" />
        <h1 className="heading-lg text-[var(--color-text)] flex items-center gap-2">
          ⚙️ Account Settings
        </h1>
        <p className="body-base text-[var(--color-text-muted)]">
          Manage your preferences and account information.
        </p>
      </header>

      <div className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6 space-y-6 max-w-2xl">
        {/* 👤 Basic Info */}
        <section>
          <h2 className="heading-sm mb-3">Profile</h2>
          <div className="space-y-2 text-sm">
            <p className="text-[var(--color-surface-text)]">
              <span className="font-medium text-[var(--color-text)]">
                <strong className="text-md">Email:</strong>
              </span>{" "}
              <span className="text-[var(--color-surface-text)]">
                {user?.email}
              </span>
            </p>
            <p className="text-[var(--color-surface-text)]">
              <span className="font-medium text-[var(--color-text)]">
                <strong className="text-md">Role:</strong>
              </span>{" "}
              <span className="text-[var(--color-surface-text)]">
                {user?.role}
              </span>
            </p>
          </div>
        </section>

        {/* 🔔 Preferences */}
        <section>
          <h2 className="heading-sm mb-3 text-[var(--color-surface-text)]">Preferences</h2>
          <div className="flex flex-col gap-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotif}
                onChange={() => setEmailNotif((prev) => !prev)}
              />
              Enable email notifications
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode((prev) => !prev)}
              />
              Enable dark mode (coming soon)
            </label>
          </div>
        </section>

        {/* ⚙️ Account Actions */}
        <section>
          <h2 className="heading-sm mb-3">Account</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="bg-[var(--color-candidate)] text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-candidate-dark)] transition"
            >
              💾 Save Changes
            </button>
            <button
              onClick={() => toast("Password reset coming soon 🔐")}
              className="border border-[var(--color-border)] px-5 py-2 rounded-[var(--radius-button)] text-[var(--color-text)] hover:bg-[var(--color-bg-hover)] transition"
            >
              🔒 Change Password
            </button>
            <button
              onClick={async () => {
                await signOut();
                toast.success("👋 Logged out successfully");
              }}
              className="bg-[var(--color-error)] text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-red-600 transition"
            >
              🚪 Log Out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

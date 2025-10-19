// src/pages/admin/AdminDashboard.tsx
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAdminStats } from "../../lib/api/admin";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const { setOverride } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<{
    total_users: number;
    total_jobs: number;
    total_submissions: number;
    total_feedbacks: number;
    avg_feedback_score: string | number;
  }>({
    total_users: 0,
    total_jobs: 0,
    total_submissions: 0,
    total_feedbacks: 0,
    avg_feedback_score: "—",
  });

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((err) => console.error("Stats load error:", err));
  }, []);

  const handleOverride = (role: "candidate" | "employer" | "admin") => {
    setOverride?.(role);
    toast.success(`🔁 Viewing as ${role}`);

    if (role === "admin") navigate("/app/admin", { replace: true });
    else if (role === "employer") navigate("/app/employer", { replace: true });
    else navigate("/app/dashboard", { replace: true });
  };

  const promoteUser = async () => {
    const { error } = await supabase.rpc("promote_to_admin");
    if (error) toast.error(error.message);
    else toast.success("✅ You are now an admin!");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      <header className="mb-8">
        <h1 className="heading-lg text-[var(--color-text)] mb-2">
          🧩 Admin Dashboard
        </h1>
        <p className="body-base text-[var(--color-text-muted)]">
          Manage your system and explore user perspectives.
        </p>
      </header>

      {/* 🧾 System Overview Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">Users</p>
          <h3 className="text-2xl font-semibold text-[var(--color-text)]">
            {stats.total_users}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">Jobs</p>
          <h3 className="text-2xl font-semibold text-[var(--color-text)]">
            {stats.total_jobs}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">Submissions</p>
          <h3 className="text-2xl font-semibold text-[var(--color-text)]">
            {stats.total_submissions}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)]">Feedbacks</p>
          <h3 className="text-2xl font-semibold text-[var(--color-text)]">
            {stats.total_feedbacks}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            ⭐ Avg Score: {stats.avg_feedback_score}
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] mb-8">
        <h2 className="heading-md mb-4">Quick Access</h2>
        <ul className="space-y-3 text-[var(--color-text)]">
          <li>
            👩‍🎓{" "}
            <button
              onClick={() => handleOverride("candidate")}
              className="hover:text-[var(--color-candidate-dark)] font-medium"
            >
              View Candidate Dashboard
            </button>
          </li>
          <li>
            🏢{" "}
            <button
              onClick={() => handleOverride("employer")}
              className="hover:text-[var(--color-employer-dark)] font-medium"
            >
              View Employer Dashboard
            </button>
          </li>
          <li>
            📊{" "}
            <button
              onClick={() => navigate("/data-viewer")}
              className="hover:text-[var(--color-candidate-dark)] font-medium"
            >
              Inspect Tables (Coming Soon)
            </button>
          </li>
        </ul>
      </section>

      {/* Actions Section */}
      <section className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]">
        <h2 className="heading-md mb-4">Admin Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => handleOverride("candidate")}
            className="bg-[var(--color-candidate)] text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-candidate-dark)] transition"
          >
            👩‍🎓 View as Candidate
          </button>

          <button
            onClick={() => handleOverride("employer")}
            className="bg-[var(--color-employer)] text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition"
          >
            🏢 View as Employer
          </button>

          <button
            onClick={() => handleOverride("admin")}
            className="bg-gray-600 text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-gray-700 transition"
          >
            🧩 Reset to Admin
          </button>

          <button
            onClick={promoteUser}
            className="bg-[var(--color-success)] text-white px-5 py-2 rounded-[var(--radius-button)] hover:bg-green-600 transition"
          >
            🔼 Promote Current User
          </button>
        </div>
      </section>
    </div>
  );
}

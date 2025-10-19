// src/pages/admin/AdminDashboard.tsx
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAdminStats } from "../../lib/api/admin";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Briefcase,
  FileSpreadsheet,
  UserCheck,
  UserCircle2,
  Database,
} from "lucide-react";

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
      {/* Header */}
      <header className="mb-10">
        <h1 className="heading-lg text-[var(--color-text)] mb-2">
          🧩 Admin Dashboard
        </h1>
        <p className="body-base text-[var(--color-text-muted)]">
          Monitor key metrics and manage platform data.
        </p>
      </header>

      {/* 🧾 System Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Users", value: stats.total_users },
          { label: "Jobs", value: stats.total_jobs },
          { label: "Submissions", value: stats.total_submissions },
          {
            label: "Feedbacks",
            value: `${stats.total_feedbacks}`,
            sub: `⭐ Avg Score: ${stats.avg_feedback_score}`,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white p-5 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)]"
          >
            <p className="text-sm text-[var(--color-text-muted)]">
              {item.label}
            </p>
            <h3 className="text-2xl font-semibold text-[var(--color-text)]">
              {item.value}
            </h3>
            {item.sub && (
              <p className="text-sm text-[var(--color-text-muted)] mt-1">
                {item.sub}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* 🚀 Quick Access */}
      <section className="mb-10">
        <h2 className="heading-md mb-4 text-[var(--color-text)]">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 👥 Manage Users */}
          <button
            onClick={() => navigate("/app/admin/users")}
            className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer text-left"
          >
            <Users size={20} className="text-[var(--color-admin-dark)]" />
            <div>
              <p className="font-medium text-[var(--color-text)]">
                Manage Users
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                View and edit user roles
              </p>
            </div>
          </button>

          {/* 💼 Jobs Overview */}
          <button
            onClick={() => navigate("/app/admin/jobs")}
            className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer text-left"
          >
            <Briefcase
              size={20}
              className="text-[var(--color-employer-dark)]"
            />
            <div>
              <p className="font-medium text-[var(--color-text)]">
                Jobs Overview
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Browse all posted jobs
              </p>
            </div>
          </button>

          {/* 🗂️ Feedback Logs */}
          <button
            onClick={() => navigate("/app/admin/feedback")}
            className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer text-left"
          >
            <FileSpreadsheet
              size={20}
              className="text-[var(--color-candidate-dark)]"
            />
            <div>
              <p className="font-medium text-[var(--color-text)]">
                Feedback Logs
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Review all candidate feedback
              </p>
            </div>
          </button>

          {/* 🧮 Data Viewer */}
          <button
            onClick={() => navigate("/data-viewer")}
            className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer text-left"
          >
            <Database size={20} className="text-[var(--color-text-muted)]" />
            <div>
              <p className="font-medium text-[var(--color-text)]">
                Data Viewer
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Inspect platform tables
              </p>
            </div>
          </button>

          {/* 👩‍🎓 View as Candidate */}
          <button
            onClick={() => handleOverride("candidate")}
            className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer text-left"
          >
            <UserCircle2
              size={20}
              className="text-[var(--color-candidate-dark)]"
            />
            <div>
              <p className="font-medium text-[var(--color-text)]">
                View as Candidate
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Switch perspective
              </p>
            </div>
          </button>

          {/* 🏢 View as Employer */}
          <button
            onClick={() => handleOverride("employer")}
            className="flex items-center gap-3 p-4 bg-white rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-bg-hover)] transition cursor-pointer text-left"
          >
            <UserCheck
              size={20}
              className="text-[var(--color-employer-dark)]"
            />
            <div>
              <p className="font-medium text-[var(--color-text)]">
                View as Employer
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Switch perspective
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 🛠 Admin Actions */}
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

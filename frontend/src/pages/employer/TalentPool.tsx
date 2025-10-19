// src/pages/employer/EmployerTalentPool.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEmployerSubmissionsWithFeedback } from "@/lib/api/submissions";
import type { EmployerSubmission } from "@/types";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EmployerTalentPool() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<EmployerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function loadTalent() {
      try {
        setLoading(true);
        const data = await getEmployerSubmissionsWithFeedback(user!.id);
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load talent pool");
      } finally {
        setLoading(false);
      }
    }
    loadTalent();
  }, [user?.id]);

  // 🧮 Compute stats
  const reviewed = submissions.filter((s) => s.status === "reviewed");
  const avgRating =
    reviewed.length > 0
      ? (
          reviewed.reduce((sum, s) => sum + (s.feedback?.[0]?.stars ?? 0), 0) /
          reviewed.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10 space-y-8">
      {/* 🧭 Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg text-[var(--color-employer-dark)]">
            🌟 Talent Pool
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Reviewed candidates from your posted jobs
          </p>
        </div>
        <button
          onClick={() => navigate("/app/employer/dashboard")}
          className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* 📊 Summary */}
      <section className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 text-center shadow-[var(--shadow-soft)]">
          <h3 className="text-sm text-[var(--color-text-muted)]">
            Total Reviewed
          </h3>
          <p className="text-2xl font-semibold text-[var(--color-text)] mt-1">
            {reviewed.length}
          </p>
        </div>
        <div className="flex-1 min-w-[200px] bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 text-center shadow-[var(--shadow-soft)]">
          <h3 className="text-sm text-[var(--color-text-muted)]">
            Average Rating
          </h3>
          <p className="text-2xl font-semibold text-[var(--color-text)] mt-1">
            {avgRating ?? "—"}
          </p>
        </div>
      </section>

      {/* 👥 Talent List */}
      <section className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <h2 className="heading-md mb-4">Candidates</h2>
        {loading ? (
          <p className="text-[var(--color-text-muted)]">
            Loading candidates...
          </p>
        ) : reviewed.length === 0 ? (
          <p className="text-[var(--color-text-muted)] italic">
            No reviewed candidates yet.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left">
                <th className="py-2 px-3">Candidate ID</th>
                <th className="py-2 px-3">Job</th>
                <th className="py-2 px-3">Task</th>
                <th className="py-2 px-3">Rating</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviewed.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-accent)] transition"
                >
                  <td className="py-2 px-3">{s.user_id}</td>
                  <td className="py-2 px-3">{s.jobs?.title || "—"}</td>
                  <td className="py-2 px-3">{s.proof_tasks?.title || "—"}</td>
                  <td className="py-2 px-3">
                    {s.feedback?.[0]?.stars
                      ? `⭐ ${s.feedback[0].stars}/5`
                      : "—"}
                  </td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => navigate(`/app/employer/review/${s.id}`)}
                      className="text-[var(--color-employer-dark)] hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

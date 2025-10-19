// src/pages/employer/EmployerTalentPool.tsx
import { useEffect, useState, type ChangeEvent } from "react";
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

  // 🧭 Filters + Sort
  const [statusFilter, setStatusFilter] = useState<
    "all" | "reviewed" | "pending"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "rating" | "job">("date");

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

  // 🧮 Filter + Sort logic
  const filtered = submissions.filter((s) =>
    statusFilter === "all" ? true : s.status === statusFilter
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "rating": {
        const ratingA = a.feedback?.[0]?.stars ?? 0;
        const ratingB = b.feedback?.[0]?.stars ?? 0;
        return ratingB - ratingA;
      }
      case "job": {
        const jobA = a.jobs?.title?.toLowerCase() ?? "";
        const jobB = b.jobs?.title?.toLowerCase() ?? "";
        return jobA.localeCompare(jobB);
      }
      default:
        return (
          new Date(b.created_at ?? "").getTime() -
          new Date(a.created_at ?? "").getTime()
        );
    }
  });

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
      <header className="flex items-center justify-between flex-wrap gap-4">
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
        <div className="flex-1 min-w-[200px] bg-[var(--color-surface)] transition-colors border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 text-center shadow-[var(--shadow-soft)]">
          <h3 className="text-sm text-[var(--color-text-muted)]">
            Total Reviewed
          </h3>
          <p className="text-2xl font-semibold text-[var(--color-text)] mt-1">
            {reviewed.length}
          </p>
        </div>
        <div className="flex-1 min-w-[200px] bg-[var(--color-surface)] transition-colors border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 text-center shadow-[var(--shadow-soft)]">
          <h3 className="text-sm text-[var(--color-text-muted)]">
            Average Rating
          </h3>
          <p className="text-2xl font-semibold text-[var(--color-text)] mt-1">
            {avgRating ?? "—"}
          </p>
        </div>
      </section>

      {/* 🔍 Controls */}
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--color-text-muted)]">
            Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setStatusFilter(e.target.value as "all" | "reviewed" | "pending")
            }
            className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="reviewed">Reviewed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-[var(--color-text-muted)]">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSortBy(e.target.value as "date" | "rating" | "job")
            }
            className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-2 py-1 text-sm"
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="job">Job</option>
          </select>
        </div>
      </section>

      {/* 👥 Talent List */}
      <section className="bg-[var(--color-surface)] transition-colors p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <h2 className="heading-md mb-4">Candidates</h2>
        {loading ? (
          <p className="text-[var(--color-text-muted)]">
            Loading candidates...
          </p>
        ) : sorted.length === 0 ? (
          <p className="text-[var(--color-text-muted)] italic">
            No candidates found for this filter.
          </p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left">
                <th className="py-2 px-3">Candidate ID</th>
                <th className="py-2 px-3">Job</th>
                <th className="py-2 px-3">Task</th>
                <th className="py-2 px-3">Rating</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
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
                  <td
                    className={`py-2 px-3 font-medium ${
                      s.status === "reviewed"
                        ? "text-green-600"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {s.status}
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

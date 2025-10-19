import { useEffect, useState, useMemo } from "react";
import { getAllFeedbackLogs } from "@/lib/api/admin";
import type { AdminFeedback } from "@/types/admin";
import toast from "react-hot-toast";
import { ArrowDownUp, Star } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await getAllFeedbackLogs();
      setFeedbacks(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to load feedback logs: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  // Derived filtered, searched, and sorted feedbacks
  const filteredFeedbacks = useMemo(() => {
    let result = feedbacks;

    // 🔍 Search (by job or email)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          f.job_title.toLowerCase().includes(term) ||
          f.candidate_email.toLowerCase().includes(term) ||
          f.employer_email.toLowerCase().includes(term)
      );
    }

    // ⭐ Rating filter
    if (ratingFilter !== "all") {
      result = result.filter((f) => Math.round(f.rating ?? 0) === ratingFilter);
    }

    // 🕓 Sort
    result = [...result].sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return result;
  }, [feedbacks, searchTerm, ratingFilter, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / perPage);
  const paginated = filteredFeedbacks.slice(
    (page - 1) * perPage,
    page * perPage
  );

  useEffect(() => {
    setPage(1); // reset when filters/search change
  }, [searchTerm, ratingFilter, perPage]);

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">
        Loading feedback logs…
      </p>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      {/* 🧭 Header */}
      <header className="mb-8 flex flex-col gap-2">
        <BackButton to="/app/admin" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="heading-lg text-[var(--color-text)]">
            🗂️ Feedback Logs
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by job or user email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-candidate-dark)]"
            />

            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐ 5 Stars</option>
              <option value="4">⭐ 4 Stars</option>
              <option value="3">⭐ 3 Stars</option>
              <option value="2">⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
              <option value="0">No Rating</option>
            </select>

            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "newest" ? "oldest" : "newest"
                )
              }
              className="flex items-center gap-2 border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white hover:bg-[var(--color-bg-hover)] transition"
            >
              <ArrowDownUp size={16} />
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        <p className="body-base text-[var(--color-text-muted)]">
          View all feedback left by employers and candidates.
        </p>
      </header>

      {/* 📋 Table */}
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
            <tr>
              <th className="py-3 px-4 text-sm font-medium">Job Title</th>
              <th className="py-3 px-4 text-sm font-medium">Candidate</th>
              <th className="py-3 px-4 text-sm font-medium">Employer</th>
              <th className="py-3 px-4 text-sm font-medium">Rating</th>
              <th className="py-3 px-4 text-sm font-medium">Comments</th>
              <th className="py-3 px-4 text-sm font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <td className="py-3 px-4">{f.job_title}</td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">
                    {f.candidate_email}
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">
                    {f.employer_email}
                  </td>
                  <td className="py-3 px-4">
                    {f.rating ? (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" /> {f.rating}
                      </div>
                    ) : (
                      <span className="text-[var(--color-text-muted)] text-sm">
                        —
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)] max-w-xs truncate">
                    {f.comment || "—"}
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">
                    {new Date(f.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-[var(--color-text-muted)]"
                >
                  No feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-sm">
        <div className="text-[var(--color-text-muted)]">
          Showing {(page - 1) * perPage + 1}–
          {Math.min(page * perPage, filteredFeedbacks.length)} of{" "}
          {filteredFeedbacks.length} feedbacks
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
          >
            Next
          </button>

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border border-[var(--color-border)] rounded px-2 py-1 bg-white"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}

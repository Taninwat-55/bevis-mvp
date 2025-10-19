// src/pages/admin/AdminJobs.tsx
import { useEffect, useState, useMemo } from "react";
import { getAllJobs } from "@/lib/api/admin";
import type { AdminJob } from "@/types/admin";
import toast from "react-hot-toast";
import { ArrowDownUp } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AdminJobs() {
  const [jobs, setJobs] = useState<AdminJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">(
    "all"
  );
  const [employerFilter, setEmployerFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to load jobs: ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Derived filtered + sorted jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(term) ||
          j.employer_email.toLowerCase().includes(term) ||
          (j.company ?? "").toLowerCase().includes(term)
      );
    }

    // status filter
    if (statusFilter !== "all") {
      result = result.filter((j) => j.status === statusFilter);
    }

    // employer filter
    if (employerFilter !== "all") {
      result = result.filter((j) => j.employer_email === employerFilter);
    }

    // sort
    result.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return result;
  }, [jobs, searchTerm, statusFilter, employerFilter, sortOrder]);

  // unique employer list for dropdown
  const uniqueEmployers = useMemo(() => {
    const emails = Array.from(
      new Set(jobs.map((j) => j.employer_email))
    ).sort();
    return emails;
  }, [jobs]);

  // pagination logic
  const totalPages = Math.ceil(filteredJobs.length / perPage);
  const paginated = filteredJobs.slice((page - 1) * perPage, page * perPage);

  // role summary counts
  const stats = useMemo(() => {
    return {
      open: jobs.filter((j) => j.status === "open").length,
      closed: jobs.filter((j) => j.status === "closed").length,
      total: jobs.length,
    };
  }, [jobs]);

  useEffect(
    () => setPage(1),
    [searchTerm, statusFilter, employerFilter, perPage]
  );

  if (loading)
    return <p className="p-8 text-[var(--color-text-muted)]">Loading jobs…</p>;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      {/* 🧭 Header */}
      <header className="mb-8 flex flex-col gap-2">
        <BackButton to="/app/admin" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="heading-lg text-[var(--color-text)]">
            💼 Job Overview
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by title, company, or employer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-candidate-dark)]"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "open" | "closed")
              }
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={employerFilter}
              onChange={(e) => setEmployerFilter(e.target.value)}
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Employers</option>
              {uniqueEmployers.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
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
          Browse all job postings across the platform.
        </p>
      </header>

      {/* 🧮 Job Summary Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Open Jobs</p>
          <h3 className="text-xl font-semibold text-green-700">{stats.open}</h3>
        </div>
        <div className="p-4 bg-gray-100 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Closed Jobs</p>
          <h3 className="text-xl font-semibold text-gray-700">
            {stats.closed}
          </h3>
        </div>
        <div className="p-4 bg-blue-50 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Total Jobs</p>
          <h3 className="text-xl font-semibold text-blue-700">{stats.total}</h3>
        </div>
      </section>

      {/* 📋 Table */}
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
            <tr>
              <th className="py-3 px-4 text-sm font-medium">Title</th>
              <th className="py-3 px-4 text-sm font-medium">Company</th>
              <th className="py-3 px-4 text-sm font-medium">Employer</th>
              <th className="py-3 px-4 text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-sm font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length ? (
              paginated.map((j) => (
                <tr
                  key={j.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <td className="py-3 px-4">{j.title}</td>
                  <td className="py-3 px-4">{j.company ?? "—"}</td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">
                    {j.employer_email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        j.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {j.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">
                    {new Date(j.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-[var(--color-text-muted)]"
                >
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-sm">
        <div className="text-[var(--color-text-muted)]">
          Showing {(page - 1) * perPage + 1}–
          {Math.min(page * perPage, filteredJobs.length)} of{" "}
          {filteredJobs.length} jobs
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

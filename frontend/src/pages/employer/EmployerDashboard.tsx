// src/pages/employer/EmployerDashboard.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getEmployerJobs,
  getEmployerSubmissions,
  getEmployerJobSummary,
} from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import type {
  EmployerJob,
  EmployerSubmission,
  EmployerJobSummary,
} from "@/types";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [submissions, setSubmissions] = useState<EmployerSubmission[]>([]);
  const [summaries, setSummaries] = useState<EmployerJobSummary[]>([]);

  // 📦 Load data
  useEffect(() => {
    if (!user) return;
    const uid = user.id;
    async function loadData() {
      try {
        const [jobsData, subsData, summariesData] = await Promise.all([
          getEmployerJobs(uid),
          getEmployerSubmissions(uid),
          getEmployerJobSummary(uid),
        ]);
        setJobs(jobsData);
        setSubmissions(subsData);
        setSummaries(summariesData);
      } catch (err) {
        console.error("Error fetching employer data:", err);
        toast.error("Failed to load dashboard data.");
      }
    }
    loadData();
  }, [user]);

  // 🧮 Quick metrics
  const totalJobs = jobs.length;
  const totalSubmissions = submissions.length;
  const avgRating = useMemo(() => {
    const ratings = summaries
      .map((s) => s.avg_score)
      .filter((v): v is number => v !== null);
    if (!ratings.length) return null;
    return (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1);
  }, [summaries]);

  const findSummary = (jobId: string) =>
    summaries.find((s) => s.job_id === jobId);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10 space-y-10">
      {/* 🧭 Header + CTA */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-lg">🏢 Employer Dashboard</h1>
        <button
          onClick={() => navigate("/app/employer/jobs/new")}
          className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-employer-dark)] transition"
        >
          + Post Job
        </button>
      </div>

      {/* 📊 Summary Metrics */}
      <section className="flex flex-wrap gap-4">
        <MetricCard title="Jobs Posted" value={totalJobs} />
        <MetricCard title="Total Submissions" value={totalSubmissions} />
        <MetricCard title="Average Rating" value={avgRating ?? "—"} />
      </section>

      {/* 💼 Jobs List */}
      <section>
        <h2 className="heading-lg mb-6">Your Jobs</h2>
        {jobs.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">No jobs posted yet.</p>
        ) : (
          <ul className="space-y-2 mb-10">
            {jobs.map((job) => {
              const summary = findSummary(job.id);
              return (
                <li
                  key={job.id}
                  onClick={() => navigate(`/app/employer/job/${job.id}`)}
                  className="cursor-pointer bg-white p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] hover:shadow-[var(--shadow-soft)] transition group"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-[var(--color-text)] group-hover:text-[var(--color-employer-dark)] transition">
                        {job.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {job.description || "No description provided."}
                      </p>
                    </div>
                    {summary && (
                      <div className="text-sm text-[var(--color-text-muted)] text-right">
                        <p>🧾 {summary.submissions_count || 0} submissions</p>
                        <p>
                          ⭐ Avg rating:{" "}
                          {summary.avg_score
                            ? Number(summary.avg_score).toFixed(1)
                            : "—"}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 🧾 Proof Submissions */}
      <section>
        <h2 className="heading-lg mb-6">Proof Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">No submissions yet.</p>
        ) : (
          <ul className="space-y-2">
            {submissions.map((s) => (
              <li
                key={s.id}
                onClick={() => navigate(`/app/employer/review/${s.id}`)}
                className="bg-white p-3 rounded-[var(--radius-card)] border border-[var(--color-border)] hover:shadow-[var(--shadow-soft)] transition"
              >
                <span className="font-medium">{s.proof_tasks?.title}</span>
                <span className="ml-2 text-[var(--color-text-muted)]">
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex-1 min-w-[200px] bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] p-4 text-center shadow-[var(--shadow-soft)]">
      <h3 className="text-sm text-[var(--color-text-muted)]">{title}</h3>
      <p className="text-2xl font-semibold text-[var(--color-text)] mt-1">
        {value}
      </p>
    </div>
  );
}

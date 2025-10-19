import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEmployerJobs } from "@/lib/api/jobs";
import type { EmployerJob } from "@/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EmployerJobListings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      try {
        const data = await getEmployerJobs(user!.id);
        setJobs(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load your jobs");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">Loading jobs...</p>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="flex items-center justify-between mb-6">
        <h1 className="heading-lg text-[var(--color-employer-dark)]">
          🧾 My Jobs
        </h1>
        <button
          onClick={() => navigate("/app/employer/jobs/new")}
          className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition"
        >
          + Post New Job
        </button>
      </header>

      {jobs.length === 0 ? (
        <p className="text-[var(--color-text-muted)] italic">
          You haven’t posted any jobs yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li
              key={job.id}
              onClick={() => navigate(`/app/employer/job/${job.id}`)}
              className="border border-[var(--color-border)] rounded-[var(--radius-card)] bg-white p-4 hover:shadow-[var(--shadow-soft)] cursor-pointer transition"
            >
              <h3 className="font-semibold text-[var(--color-text)]">
                {job.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {job.company || "No company"} • {job.location || "Remote"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

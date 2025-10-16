import { Link } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";

export default function JobListings() {
  const { jobs, loading, error } = useJobs();

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">Loading jobs...</p>
    );
  if (error)
    return <p className="p-8 text-[var(--color-error)]">Error: {error}</p>;
  if (!jobs.length)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">No jobs posted yet.</p>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-10">
        <h1 className="heading-lg">🔍 Browse Proof Opportunities</h1>
        <p className="body-base mt-1">
          Find a role that matches your skills and start proving your ability.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => {
          const proof = job.proof_tasks?.[0];
          return (
            <div
              key={job.id}
              className="bg-white rounded-[var(--radius-card)] p-6 border border-[var(--color-border)] shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                {job.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">
                {job.company} • {job.location}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                {proof?.title || "Proof task available"}
              </p>
              <div className="flex items-center justify-between text-sm mb-4">
                <span>
                  ⏱{" "}
                  {proof?.duration_minutes
                    ? `${proof.duration_minutes} min`
                    : "—"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.paid
                      ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                      : "bg-[var(--color-candidate-light)]/10 text-[var(--color-candidate-dark)]"
                  }`}
                >
                  {job.paid ? "Paid" : "XP only"}
                </span>
              </div>
              <Link
                to={`/candidate/job/${job.id}`}
                className="block text-center bg-[var(--color-candidate)] text-white py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-candidate-dark)] transition"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

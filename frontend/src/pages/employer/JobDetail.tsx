import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getJobWithTasks } from "@/lib/api/jobs";
import { getEmployerSubmissions } from "@/lib/api/submissions";
import type { EmployerJob, EmployerSubmission, ProofTask } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState<
    (EmployerJob & { proof_tasks?: ProofTask[] }) | null
  >(null);
  const [submissions, setSubmissions] = useState<EmployerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧭 Load job data + submissions
  useEffect(() => {
    if (!id || !user?.id) return;

    async function loadData() {
      try {
        setLoading(true);
        const [jobData, allSubs] = await Promise.all([
          getJobWithTasks(id!),
          getEmployerSubmissions(user!.id),
        ]);
        setJob(jobData);
        const jobSubs = allSubs.filter((s) => s.job_id === id);
        // relevant job submissions
        // const jobSubs = allSubs.filter(
        //   (s) => s.proof_tasks && s.proof_tasks.id && s.status
        // ); 
        setSubmissions(jobSubs);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job details or submissions");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, user?.id]);

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">
        Loading job details...
      </p>
    );

  if (!job)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">
        Job not found or no longer available.
      </p>
    );

  const { title, description, company, location, paid, proof_tasks = [] } = job;

  // 🧮 Compute summary
  const totalSubs = submissions.length;
  const reviewedSubs = submissions.filter(
    (s) => s.status === "reviewed"
  ).length;
  const pendingSubs = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10 flex flex-col gap-6">
      {/* 🧭 Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="heading-lg text-[var(--color-employer-dark)]">
            💼 {title}
          </h1>
          <p className="text-[var(--color-text-muted)]">
            {company || "Unknown company"} • {location || "Remote"}
          </p>
        </div>

        <button
          onClick={() => navigate("/app/employer/dashboard")}
          className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
        >
          ← Back to Dashboard
        </button>
      </header>

      {/* 🧾 Job Description */}
      <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6 max-w-3xl">
        <h2 className="heading-md mb-2">Job Description</h2>
        <p className="text-[var(--color-text-muted)] whitespace-pre-line leading-relaxed">
          {description || "No description provided."}
        </p>
        <div className="flex items-center gap-3 mt-4 text-sm text-[var(--color-text-muted)]">
          <span>📍 {location || "Remote"}</span>
          {paid && (
            <span className="bg-[var(--color-employer-light)] text-[var(--color-employer-dark)] px-2 py-1 rounded-[var(--radius-button)] text-xs font-medium">
              Paid Opportunity
            </span>
          )}
        </div>
      </section>

      {/* 🧠 Proof Tasks */}
      <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6 max-w-3xl">
        <h2 className="heading-md mb-4">Proof Tasks</h2>
        {proof_tasks.length === 0 ? (
          <p className="text-[var(--color-text-muted)] italic">
            No proof tasks linked to this job.
          </p>
        ) : (
          <ul className="space-y-4">
            {proof_tasks.map((task) => (
              <li
                key={task.id}
                className="border border-[var(--color-border)] rounded-[var(--radius-button)] p-4 hover:shadow-[var(--shadow-soft)] transition"
              >
                <h3 className="font-semibold text-[var(--color-text)] mb-1">
                  {task.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-2">
                  {task.description}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  ⏱ Expected Time: {task.expected_time || "—"}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  📄 Format: {task.submission_format}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  🤖 AI Tools Allowed: {task.ai_tools_allowed ? "Yes" : "No"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 📊 Submissions Summary */}
      <section className="bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6 max-w-3xl">
        <h2 className="heading-md mb-4">Candidate Submissions</h2>

        {submissions.length === 0 ? (
          <p className="text-[var(--color-text-muted)] italic">
            No candidates have submitted proofs yet.
          </p>
        ) : (
          <>
            <div className="flex gap-6 mb-4">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Total Submissions
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {totalSubs}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Reviewed
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {reviewedSubs}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Pending
                </p>
                <p className="text-2xl font-semibold text-[var(--color-text)]">
                  {pendingSubs}
                </p>
              </div>
            </div>

            <ul className="space-y-2">
              {submissions.map((s) => (
                <li
                  key={s.id}
                  onClick={() => navigate(`/app/employer/review/${s.id}`)}
                  className="cursor-pointer border border-[var(--color-border)] rounded-[var(--radius-button)] p-3 hover:bg-[var(--color-bg-accent)] transition"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {s.proof_tasks?.title || "Untitled Task"}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        s.status === "reviewed"
                          ? "text-green-600"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* ✏️ Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigate(`/app/employer/job/${id}/edit`)}
          className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition"
        >
          ✏️ Edit Job
        </button>
        <button
          onClick={() => navigate(`/app/employer/submissions`)}
          className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
        >
          📂 View All Submissions
        </button>
      </div>
    </div>
  );
}

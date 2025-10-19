import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEmployerSubmissionsWithFeedback } from "@/lib/api/submissions";
import type { EmployerSubmission } from "@/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EmployerSubmissions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<EmployerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      try {
        const data = await getEmployerSubmissionsWithFeedback(user!.id);
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">
        Loading submissions...
      </p>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-6">
        <h1 className="heading-lg text-[var(--color-employer-dark)]">
          📂 Candidate Submissions
        </h1>
        <p className="text-[var(--color-text-muted)]">
          View and manage all candidate submissions.
        </p>
      </header>

      {submissions.length === 0 ? (
        <p className="text-[var(--color-text-muted)] italic">
          No submissions found.
        </p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((s) => (
            <li
              key={s.id}
              onClick={() => navigate(`/app/employer/review/${s.id}`)}
              className="border border-[var(--color-border)] rounded-[var(--radius-card)] bg-[var(--color-surface)] transition-colors p-4 hover:shadow-[var(--shadow-soft)] cursor-pointer transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">
                    {s.proof_tasks?.title || "Untitled Task"}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Candidate ID: {s.user_id}
                  </p>
                </div>
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
      )}
    </div>
  );
}

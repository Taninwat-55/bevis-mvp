import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { getCandidateFeedback } from "../../lib/api/submissions";

interface FeedbackItem {
  strengths?: string | null;
  improvements?: string | null;
  stars?: number | null;
  created_at?: string | null;
}

interface SubmissionItem {
  id: string;
  created_at: string | null;
  status: string | null;
  jobs?: { title: string; company?: string | null } | null;
  proof_tasks?: { title: string } | null;
  feedback?: FeedbackItem[] | null;
}

export default function FeedbackView() {
  const { user } = useAuth();
  const [proofs, setProofs] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    getCandidateFeedback(user.id)
      .then((data) => setProofs(data as SubmissionItem[]))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">Loading feedback...</p>
    );

  if (!proofs.length)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">
        No proofs submitted yet.
      </p>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-10">
        <h1 className="heading-lg">📜 My Proofs & Feedback</h1>
        <p className="body-base mt-1">
          See feedback and ratings from employers.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proofs.map((p) => {
          const fb = p.feedback?.[0];
          const reviewed = p.status === "reviewed" && fb;

          return (
            <div
              key={p.id}
              className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">
                {p.proof_tasks?.title || "Proof Task"}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                {p.jobs?.title} • {p.jobs?.company}
              </p>

              {reviewed ? (
                <>
                  <div className="flex items-center mb-3">
                    {"★".repeat(fb.stars || 0)}
                    {"☆".repeat(5 - (fb.stars || 0))}
                    <span className="ml-2 text-sm text-[var(--color-text-muted)]">
                      {fb.stars}/5
                    </span>
                  </div>
                  <p className="text-sm mb-1">
                    <strong>Strengths:</strong> {fb.strengths}
                  </p>
                  <p className="text-sm mb-1">
                    <strong>Improvements:</strong> {fb.improvements}
                  </p>
                </>
              ) : (
                <p className="text-[var(--color-text-muted)] italic">
                  Awaiting feedback from employer...
                </p>
              )}

              <p className="text-xs text-[var(--color-text-muted)] mt-3">
                Submitted{" "}
                {p.created_at
                  ? new Date(p.created_at).toLocaleDateString()
                  : "–"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

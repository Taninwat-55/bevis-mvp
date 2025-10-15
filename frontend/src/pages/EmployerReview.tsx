// src/pages/EmployerReview.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type SubmissionView = {
  submission_id: string;
  candidate_name: string | null;
  job_title: string | null;
  task_title: string | null;
  rating: number | null;
  comments: string | null;
  reviewed_at: string | null;
};

export default function EmployerReview() {
  const [submissions, setSubmissions] = useState<SubmissionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubs() {
      setLoading(true);
      const { data, error } = await supabase.from("proof_cards").select("*");
      if (error) {
        setError(error.message);
      } else {
        // FIX: Filter out any items where submission_id is null before setting state
        const validSubmissions =
          data?.filter(
            (sub): sub is SubmissionView => sub.submission_id !== null
          ) || [];
        setSubmissions(validSubmissions);
      }
      setLoading(false);
    }
    fetchSubs();
  }, []);

  if (loading)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">Loading submissions…</p>
    );
  if (error)
    return <p className="p-8 text-[var(--color-error)]">Error: {error}</p>;

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="heading-lg mb-6 text-employer">🏢 Employer Review</h1>
      {submissions.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">No submissions yet.</p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <li
              key={s.submission_id}
              className="bg-white border border-[var(--color-border)] rounded-card p-6 shadow-soft hover:shadow-hover transition"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {s.candidate_name} – {s.job_title}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)] mb-2">
                Task: {s.task_title}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Rating: {s.rating ?? "Not rated yet"}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Comments: {s.comments ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

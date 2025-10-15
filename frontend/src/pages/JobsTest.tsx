// src/pages/JobsTest.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Database } from "../lib/Database";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

export default function JobsTest() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase.from("jobs").select("*");
      if (error) setError(error.message);
      else setJobs(data || []);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  if (loading)
    return <p className="p-8 text-[var(--color-text-muted)]">Loading jobs…</p>;
  if (error)
    return <p className="p-8 text-[var(--color-error)]">Error: {error}</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="heading-lg mb-6 text-candidate">🎓 Open Roles</h1>

      {selectedJob ? (
        <SubmitProofForm
          job={selectedJob}
          onBack={() => setSelectedJob(null)}
        />
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              className="bg-white border border-[var(--color-border)] rounded-card p-6 shadow-soft hover:shadow-hover transition"
            >
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {job.title}
              </h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {job.description}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                Skills: {job.required_skills?.join(", ") || "—"}
              </p>
              <button
                onClick={() => setSelectedJob(job)}
                className="mt-4 bg-candidate text-white px-4 py-2 rounded-button shadow-soft hover:bg-candidate-dark transition"
              >
                Submit Proof
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Submit Proof Form ---------- */
function SubmitProofForm({ job, onBack }: { job: Job; onBack: () => void }) {
  const [submissionLink, setSubmissionLink] = useState("");
  const [reflection, setReflection] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const fakeUserId = "00000000-0000-0000-0000-000000000001";

    const { data: proofTask } = await supabase
      .from("proof_tasks")
      .select("id")
      .eq("job_id", job.id)
      .limit(1)
      .single();

    if (!proofTask) {
      setMessage("⚠️ No proof task found for this job.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("submissions").insert({
      user_id: fakeUserId,
      proof_task_id: proofTask.id,
      submission_link: submissionLink,
      reflection,
    });

    setMessage(error ? `❌ ${error.message}` : "✅ Proof submitted!");
    setLoading(false);
  }

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-card p-6 shadow-soft">
      <button
        onClick={onBack}
        className="text-sm text-candidate hover:underline mb-4"
      >
        ← Back to Jobs
      </button>

      <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">
        Submit Proof for {job.title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">
            Submission Link
          </label>
          <input
            type="url"
            required
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            className="mt-1 w-full border border-[var(--color-border)] rounded-button px-3 py-2 text-sm focus:ring-2 focus:ring-candidate-light"
            placeholder="https://github.com/yourproject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)]">
            Reflection (optional)
          </label>
          <textarea
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="mt-1 w-full border border-[var(--color-border)] rounded-button px-3 py-2 text-sm focus:ring-2 focus:ring-candidate-light"
            placeholder="Briefly describe your approach"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-candidate text-white px-4 py-2 rounded-button shadow-soft hover:bg-candidate-dark transition disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Proof"}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.startsWith("✅")
                ? "text-[var(--color-success)]"
                : "text-[var(--color-error)]"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

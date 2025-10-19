import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProofTaskDetails, submitProof } from "../../lib/api";

interface ProofTask {
  id: string;
  job_id: string;
  title: string;
  description?: string | null;
  expected_time?: string | null;
  submission_format?: string | null;
  ai_tools_allowed?: boolean | null;
}

export default function CandidateProofWorkspace() {
  const { id: proof_task_id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<ProofTask | null>(null);
  const [link, setLink] = useState("");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!proof_task_id) return;
    getProofTaskDetails(proof_task_id)
      .then((res) => setTask(res as ProofTask))
      .catch((err) => toast.error(err.message));
  }, [proof_task_id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!link.trim()) return toast.error("Please include your GitHub link.");

    setLoading(true);
    try {
      if (!task) throw new Error("Task not found");
      await submitProof({
        job_id: task.job_id,
        submission_link: link,
        reflection,
      });
      toast.success("🚀 Proof submitted successfully! Feedback within 24h.");
      navigate("/candidate/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }

  if (!task)
    return <p className="p-8 text-[var(--color-text-muted)]">Loading task…</p>;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-8">
        <h1 className="heading-lg mb-1">{task.title}</h1>
        <p className="text-[var(--color-text-muted)]">
          {task.description || "Complete the proof as described below."}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Left Panel: Instructions --- */}
        <section className="bg-[var(--color-surface)] transition-colors p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
          <h2 className="heading-md mb-4">Instructions</h2>
          <ul className="text-sm text-[var(--color-text-muted)] space-y-2">
            <li>⏱ Expected Time: {task.expected_time || "30 min"}</li>
            <li>
              📦 Submission Format: {task.submission_format || "GitHub link"}
            </li>
            <li>
              🤖 AI Tools Allowed:{" "}
              {task.ai_tools_allowed ? (
                <span className="text-[var(--color-success)] font-medium">
                  Yes
                </span>
              ) : (
                <span className="text-[var(--color-error)] font-medium">
                  No
                </span>
              )}
            </li>
          </ul>
          <div className="mt-4 text-sm">
            <p className="font-medium text-[var(--color-text)]">Task Brief:</p>
            <p className="text-[var(--color-text-muted)] mt-1">
              {task.description}
            </p>
          </div>
        </section>

        {/* --- Right Panel: Submission Form --- */}
        <section className="bg-[var(--color-surface)] transition-colors p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                GitHub Repo URL
              </label>
              <input
                type="url"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Paste your GitHub repo or branch link here"
                className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-candidate-light)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                Reflection (optional)
              </label>
              <textarea
                rows={4}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Describe your approach — did you use any AI tools?"
                className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-candidate-light)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-candidate)] text-white py-2 rounded-[var(--radius-button)] font-medium hover:bg-[var(--color-candidate-dark)] transition disabled:opacity-50"
            >
              {loading ? "Submitting…" : "🚀 Submit Proof"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

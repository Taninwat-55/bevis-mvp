// src/pages/employer/PostJob.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";
import { notify } from "@/components/ui/Notify";
import { getErrorMessage } from "@/lib/error";

export default function EmployerPostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 → Job Info
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    paid: false,
    description: "",
  });

  // Step 2 → Proof Task
  const [task, setTask] = useState({
    title: "",
    description: "",
    expected_time: "15m",
    submission_format: "Link + Reflection",
    ai_tools_allowed: true,
  });

  async function handlePublish() {
    if (!user?.id) return notify.error("Not authenticated.");
    if (!job.title || !task.title)
      return notify.error("Please complete all required fields.");

    setLoading(true);
    try {
      // 1️⃣ Create job
      const { data: jobData, error: jobErr } = await supabase
        .from("jobs")
        .insert([
          {
            title: job.title,
            company: job.company,
            location: job.location,
            paid: job.paid,
            description: job.description,
            employer_id: user.id,
          },
        ])
        .select("id")
        .single();
      if (jobErr) throw jobErr;

      // 2️⃣ Create proof task
      const { error: taskErr } = await supabase.from("proof_tasks").insert([
        {
          job_id: jobData.id,
          title: task.title,
          description: task.description,
          expected_time: task.expected_time,
          submission_format: task.submission_format,
          ai_tools_allowed: task.ai_tools_allowed,
        },
      ]);
      if (taskErr) throw taskErr;

      notify.success("✅ Job and proof task published!");
      navigate(`/app/employer/job/${jobData.id}`);
    } catch (err: unknown) {
      notify.error(getErrorMessage(err, "Failed to publish job."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <div className="bg-white border border-[var(--color-border)] shadow-[var(--shadow-soft)] rounded-[var(--radius-card)] max-w-2xl mx-auto p-8">
        <h1 className="heading-lg mb-2 text-[var(--color-employer-dark)]">
          🧭 Post a New Job
        </h1>
        <p className="text-[var(--color-text-muted)] mb-6">Step {step} of 3</p>

        {/* Step 1: Job Info */}
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Job Title</label>
            <input
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium">Company</label>
            <input
              value={job.company}
              onChange={(e) => setJob({ ...job, company: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium">Location</label>
            <input
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <label className="inline-flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={job.paid}
                onChange={(e) => setJob({ ...job, paid: e.target.checked })}
              />
              <span>Paid opportunity</span>
            </label>

            <label className="block text-sm font-medium mt-2">
              Description
            </label>
            <textarea
              rows={3}
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Proof Task */}
        {step === 2 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Proof Task Title
            </label>
            <input
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium">
              Task Description
            </label>
            <textarea
              rows={3}
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <label className="block text-sm font-medium">Expected Time</label>
            <select
              value={task.expected_time}
              onChange={(e) =>
                setTask({ ...task, expected_time: e.target.value })
              }
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            >
              <option value="10m">10 minutes</option>
              <option value="15m">15 minutes</option>
              <option value="30m">30 minutes</option>
            </select>

            <label className="block text-sm font-medium">
              Submission Format
            </label>
            <input
              value={task.submission_format}
              onChange={(e) =>
                setTask({ ...task, submission_format: e.target.value })
              }
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
            />

            <label className="inline-flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={task.ai_tools_allowed}
                onChange={(e) =>
                  setTask({ ...task, ai_tools_allowed: e.target.checked })
                }
              />
              <span>AI tools allowed</span>
            </label>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setStep(1)}
                className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="heading-md mb-3">Review your job post</h2>
            <div className="text-sm space-y-1 text-[var(--color-text)]">
              <p>
                <strong>Title:</strong> {job.title}
              </p>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Task:</strong> {task.title}
              </p>
              <p>
                <strong>Expected:</strong> {task.expected_time}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
              >
                ← Back
              </button>
              <button
                disabled={loading}
                onClick={handlePublish}
                className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

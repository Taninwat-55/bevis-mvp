// src/pages/employer/EmployerReview.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createFeedback } from "../../lib/api/feedback";
import { updateSubmissionStatus } from "../../lib/api/mutations";
import { getSubmissionById } from "../../lib/api/submissions";
import { useAuth } from "../../hooks/useAuth";
import type { EmployerSubmission } from "@/types";

export default function EmployerReviewProof() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<
    | (EmployerSubmission & {
        jobs?: { id: string; title: string; company?: string | null } | null;
      })
    | null
  >(null);

  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🧭 Load submission by ID
  useEffect(() => {
    if (!id) return;
    getSubmissionById(id)
      .then(setSubmission)
      .catch((err) => {
        console.error("Error fetching submission:", err);
        toast.error("Failed to load submission details");
      });
  }, [id]);

  if (!submission)
    return (
      <p className="p-8 text-[var(--color-text-muted)]">
        Loading submission details...
      </p>
    );

  async function handleSubmitFeedback() {
    if (!user?.id) return toast.error("Not authenticated");
    if (!stars) return toast.error("Please add a rating");

    setLoading(true);
    try {
      await createFeedback({
        submission_id: submission!.id,
        employer_id: user.id,
        strengths,
        improvements,
        stars,
      });

      await updateSubmissionStatus(submission!.id, "reviewed");
      toast.success("✅ Feedback submitted successfully!");

      navigate("/employer/review/success");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10 flex flex-col gap-6">
      <header>
        <h1 className="heading-lg mb-2">
          🧾 Review Submission – {submission.proof_tasks?.title}
        </h1>
        <p className="body-base text-[var(--color-text-muted)]">
          Job: {submission.jobs?.title} • Candidate ID: {submission.user_id}
        </p>
      </header>

      <section className="bg-[var(--color-surface)] transition-colors p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] max-w-2xl">
        <p className="text-sm mb-3 text-[var(--color-text-muted)]">
          <strong>Submission Link:</strong>{" "}
          <a
            href={submission.submission_link ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-employer-dark)] underline"
          >
            {submission.submission_link}
          </a>
        </p>
        <p className="text-sm mb-6 text-[var(--color-text-muted)]">
          <strong>Candidate Reflection:</strong>{" "}
          {submission.reflection || "No reflection provided."}
        </p>

        <h2 className="heading-md mb-4">Leave Feedback</h2>

        <label className="block text-sm font-medium mb-1">Strengths</label>
        <textarea
          placeholder="What stood out in this proof?"
          className="w-full border rounded p-2 mb-3 text-sm"
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">Improvements</label>
        <textarea
          placeholder="Suggestions for improvement"
          className="w-full border rounded p-2 mb-3 text-sm"
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">Rating</label>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={stars}
          onChange={(e) => setStars(Number(e.target.value))}
          className="w-full accent-[var(--color-employer)] mb-3"
        />
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          {stars ? `${stars} / 5 stars` : "Select rating"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleSubmitFeedback}
            disabled={loading}
            className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          {/* 🡐 Back Button */}
          <button
            type="button"
            onClick={() => navigate("/employer/dashboard")}
            className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}

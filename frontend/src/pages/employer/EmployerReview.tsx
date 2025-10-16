import { useState } from "react";
import toast from "react-hot-toast";
import { updateSubmissionStatus, addFeedback } from "../../lib/api/mutations";

export default function EmployerReview({ submission }) {
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [stars, setStars] = useState(0);

  async function handleSubmitFeedback() {
    try {
      await addFeedback({
        submission_id: submission.id,
        employer_id: submission.jobs.created_by, // or user.id
        strengths,
        improvements,
        stars,
      });

      await updateSubmissionStatus(submission.id, "reviewed");
      toast.success("✅ Feedback submitted and status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    }
  }

  return (
    <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)]">
      <h2 className="heading-md mb-2">Leave Feedback</h2>
      <textarea
        placeholder="Strengths..."
        className="w-full border rounded p-2 mb-3"
        value={strengths}
        onChange={(e) => setStrengths(e.target.value)}
      />
      <textarea
        placeholder="Improvements..."
        className="w-full border rounded p-2 mb-3"
        value={improvements}
        onChange={(e) => setImprovements(e.target.value)}
      />
      <input
        type="number"
        min={0}
        max={5}
        value={stars}
        onChange={(e) => setStars(Number(e.target.value))}
        className="border rounded p-2 mb-3 w-24"
      />
      <button
        onClick={handleSubmitFeedback}
        className="bg-[var(--color-employer)] text-white px-4 py-2 rounded hover:bg-[var(--color-employer-dark)]"
      >
        Submit
      </button>
    </div>
  );
}

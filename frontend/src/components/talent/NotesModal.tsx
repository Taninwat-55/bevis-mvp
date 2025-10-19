import { useState } from "react";
import { createPortal } from "react-dom";
import { updateHiringStage } from "@/lib/api/mutations";
import toast from "react-hot-toast";
import type { EmployerSubmission } from "@/types";

interface NotesModalProps {
  submission: EmployerSubmission | null;
  onClose: () => void;
  onSave?: (updated: Partial<EmployerSubmission>) => void;
}

export default function NotesModal({
  submission,
  onClose,
  onSave,
}: NotesModalProps) {
  const [note, setNote] = useState(submission?.employer_notes ?? "");
  const [loading, setLoading] = useState(false);

  if (!submission) return null;

  async function handleSave() {
    try {
      setLoading(true);
      // ✅ non-null assertion: we’ve already guarded above
      const updated = await updateHiringStage(
        submission!.id,
        submission!.hiring_stage ?? "new",
        note
      );
      toast.success("Notes updated!");
      onSave?.(updated as Partial<EmployerSubmission>);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notes");
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-[var(--radius-card)] shadow-xl w-full max-w-md p-6">
        <h2 className="heading-md mb-3">📝 Manage Notes</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-3">
          Candidate ID:{" "}
          <span className="font-medium">{submission.user_id}</span>
        </p>

        <textarea
          className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] p-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-employer-light)]"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your private notes or thoughts about this candidate..."
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="border border-[var(--color-border)] text-[var(--color-text-muted)] px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-border)] transition"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleSave}
            className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Notes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

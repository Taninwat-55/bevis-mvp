import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { updateHiringStage } from "@/lib/api/mutations";
import type { EmployerSubmission, HiringStage } from "@/types";
import NotesModal from "./NotesModal";

const STAGES: HiringStage[] = [
  "new",
  "shortlisted",
  "interview",
  "hold",
  "hired",
  "rejected",
];

export default function CandidateCard({
  submission,
}: {
  submission: EmployerSubmission;
}) {
  const { id, user_id, proof_tasks, feedback, employer_notes, hiring_stage } =
    submission;
  const [open, setOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 0.2s ease, opacity 0.2s",
    opacity: isDragging ? 0.5 : 1,
  };

  async function handleMove(stage: HiringStage) {
    try {
      await updateHiringStage(id, stage, employer_notes ?? "");
      toast.success(`Moved to ${stage}`);
      setOpen(false);
    } catch {
      toast.error("Failed to move candidate");
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative bg-[var(--color-surface)] border border-[var(--color-border)] 
      rounded-[var(--radius-button)] p-3 cursor-grab hover:shadow-[var(--shadow-soft)] transition`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium text-sm text-[var(--color-text)] truncate">
          👤 {user_id || "Unknown"}
        </h4>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setOpen((prev) => !prev)}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
        >
          <MoreHorizontal size={14} />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute right-2 top-6 z-[999] bg-[var(--color-surface)] border border-[var(--color-border)]
               rounded-[var(--radius-card)] shadow-xl text-sm "
            onPointerDown={(e) => e.stopPropagation()}
          >
            {STAGES.map((stage) => (
              <button
                key={stage}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMove(stage);
                }}
                disabled={stage === hiring_stage}
                className={`block w-full text-left px-3 py-1.5 hover:bg-[var(--color-bg-accent)] ${
                  stage === hiring_stage
                    ? "text-[var(--color-text-muted)] opacity-70"
                    : ""
                }`}
              >
                Move to {stage}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      {feedback?.[0]?.stars ? (
        <span className="text-xs text-yellow-500 font-medium">
          ⭐ {feedback[0].stars}/5
        </span>
      ) : (
        <span className="text-xs text-[var(--color-text-muted)]">—</span>
      )}

      {/* Task title */}
      <p className="text-xs text-[var(--color-text-muted)] truncate">
        {proof_tasks?.title || "Untitled task"}
      </p>

      {/* Notes */}
      {employer_notes && (
        <p className="text-xs text-[var(--color-text-muted)] italic mt-1 truncate">
          📝 {employer_notes}
        </p>
      )}
      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setShowNotes(true)}
        className="text-xs text-[var(--color-employer-dark)] hover:underline mt-1"
      >
        {employer_notes ? "Edit Notes" : "Add Note"}
      </button>

      {showNotes && (
        <NotesModal
          submission={submission}
          onClose={() => setShowNotes(false)}
          onSave={(updated) => console.log("Updated:", updated)}
        />
      )}
    </div>
  );
}

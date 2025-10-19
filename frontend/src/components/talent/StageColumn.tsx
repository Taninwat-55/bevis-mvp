import CandidateCard from "./CandidateCard";
import type { EmployerSubmission, HiringStage } from "@/types";

// -----------------------------
// Props
// -----------------------------
interface StageColumnProps {
  stage: HiringStage;
  label: string;
  submissions: EmployerSubmission[];
}

const stageColors: Record<HiringStage, string> = {
  new: "border-[var(--stage-new-border)] bg-[var(--stage-new-bg)]",
  shortlisted:
    "border-[var(--stage-shortlisted-border)] bg-[var(--stage-shortlisted-bg)]",
  interview:
    "border-[var(--stage-interview-border)] bg-[var(--stage-interview-bg)]",
  hold: "border-[var(--stage-hold-border)] bg-[var(--stage-hold-bg)]",
  hired: "border-[var(--stage-hired-border)] bg-[var(--stage-hired-bg)]",
  rejected:
    "border-[var(--stage-rejected-border)] bg-[var(--stage-rejected-bg)]",
};

// -----------------------------
// Component
// -----------------------------
export default function StageColumn({
  stage,
  label,
  submissions,
}: StageColumnProps) {
  return (
    <div
      className={`flex flex-col border rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-soft)] h-[75vh] ${stageColors[stage]}`}
    >
      {/* 🧭 Column Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[var(--color-text)] text-sm">
          {label}
        </h3>
        <span className="text-xs text-[var(--color-text-muted)]">
          {submissions.length}
        </span>
      </div>

      {/* 🧩 Cards Container */}
      <div className="overflow-y-auto pr-1 flex-1">
        {submissions.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)] italic text-center mt-6">
            No candidates
          </p>
        ) : (
          <div className="space-y-2">
            {submissions.map((submission) => (
              <CandidateCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import CandidateCard from "./CandidateCard";
import type { EmployerSubmission, HiringStage } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface StageColumnProps {
  stage: HiringStage;
  label: string;
  submissions: EmployerSubmission[];
}

const stageColors: Record<HiringStage, string> = {
  new: "bg-[hsl(228,100%,97%)] dark:bg-[hsl(228,20%,16%)] border-[hsl(228,70%,60%)]",
  shortlisted:
    "bg-[hsl(45,100%,96%)] dark:bg-[hsl(45,20%,18%)] border-[hsl(45,90%,55%)]",
  interview:
    "bg-[hsl(200,100%,96%)] dark:bg-[hsl(200,25%,17%)] border-[hsl(200,85%,55%)]",
  hold: "bg-[hsl(0,0%,96%)] dark:bg-[hsl(0,0%,18%)] border-[hsl(0,0%,60%)]",
  hired:
    "bg-[hsl(140,60%,94%)] dark:bg-[hsl(140,20%,16%)] border-[hsl(140,70%,45%)]",
  rejected:
    "bg-[hsl(0,90%,96%)] dark:bg-[hsl(0,25%,16%)] border-[hsl(0,75%,50%)]",
};

export default function StageColumn({
  stage,
  label,
  submissions,
}: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: { stage },
  });

  return (
    <div
      className={`flex flex-col rounded-xl border p-4 shadow-sm h-[75vh] min-w-[16rem]
        transition-all duration-150 ${stageColors[stage]} ${
        isOver ? "ring-2 ring-[var(--color-employer)] scale-[1.01]" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`font-semibold text-sm px-2 py-1 rounded-md text-white ${
            stage === "hired"
              ? "bg-[hsl(140,70%,45%)]"
              : stage === "rejected"
              ? "bg-[hsl(0,75%,50%)]"
              : stage === "shortlisted"
              ? "bg-[hsl(45,90%,55%)] text-black"
              : stage === "new"
              ? "bg-violet-500"
              : stage === "interview"
              ? "bg-blue-500"
              : stage === "hold"
              ? "bg-stone-600"
              : "bg-[var(--color-border)] text-[var(--color-text)]"
          }`}
        >
          {label}
        </h3>
        <span className="text-xs text-[var(--color-text-muted)]">
          {submissions.length}
        </span>
      </div>

      {/* Make cards inside this column sortable */}
      <SortableContext
        id={stage}
        items={submissions.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="overflow-y-auto pr-1 flex-1 space-y-2">
          {submissions.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] italic text-center mt-6">
              No candidates
            </p>
          ) : (
            submissions.map((submission) => (
              <CandidateCard key={submission.id} submission={submission} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

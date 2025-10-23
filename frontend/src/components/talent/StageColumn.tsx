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
  new: "bg-[hsl(230,100%,98%)] dark:bg-[hsl(230,15%,12%)] border-[hsl(230,70%,75%)]",
  shortlisted:
    "bg-[hsl(45,100%,98%)] dark:bg-[hsl(45,15%,12%)] border-[hsl(45,70%,70%)]",
  interview:
    "bg-[hsl(200,100%,98%)] dark:bg-[hsl(200,15%,12%)] border-[hsl(200,70%,70%)]",
  hold: "bg-[hsl(0,0%,98%)] dark:bg-[hsl(0,0%,14%)] border-[hsl(0,0%,70%)]",
  hired:
    "bg-[hsl(140,100%,98%)] dark:bg-[hsl(140,15%,12%)] border-[hsl(140,70%,65%)]",
  rejected:
    "bg-[hsl(0,100%,98%)] dark:bg-[hsl(0,15%,12%)] border-[hsl(0,70%,70%)]",
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
        <h3 className="font-semibold text-sm text-[var(--color-text)]">
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

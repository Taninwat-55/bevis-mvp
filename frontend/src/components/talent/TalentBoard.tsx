import { useMemo } from "react";
import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { updateHiringStage } from "@/lib/api/mutations";
import toast from "react-hot-toast";
import type { EmployerSubmission, HiringStage } from "@/types";
import StageColumn from "./StageColumn";

// -----------------------------
// Props
// -----------------------------
interface TalentBoardProps {
  submissions: EmployerSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<EmployerSubmission[]>>;
}

// -----------------------------
// Hiring Stages Setup
// -----------------------------
const STAGES: { key: HiringStage; label: string; emoji: string }[] = [
  { key: "new", label: "New", emoji: "🆕" },
  { key: "shortlisted", label: "Shortlisted", emoji: "⭐" },
  { key: "interview", label: "Interview", emoji: "💬" },
  { key: "hold", label: "On Hold", emoji: "⏸" },
  { key: "hired", label: "Hired", emoji: "🎉" },
  { key: "rejected", label: "Rejected", emoji: "❌" },
];

// -----------------------------
// Component
// -----------------------------
export default function TalentBoard({
  submissions,
  setSubmissions,
}: TalentBoardProps) {
  // Group submissions by stage
  const grouped = useMemo(() => {
    const groups: Record<string, EmployerSubmission[]> = {};
    for (const s of submissions) {
      const stage = s.hiring_stage || "new";
      if (!groups[stage]) groups[stage] = [];
      groups[stage].push(s);
    }
    return groups;
  }, [submissions]);

  // Handle drag end
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !active || active.id === over.id) return;

    // Get dragged submission
    const dragged = submissions.find((s) => s.id === active.id);
    const newStage = over.id as HiringStage;
    if (!dragged || dragged.hiring_stage === newStage) return;

    try {
      await updateHiringStage(String(active.id), newStage);
      toast.success(`Moved candidate to ${newStage}`);
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === active.id ? { ...s, hiring_stage: newStage } : s
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update stage");
    }
  }

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto pb-6">
        {STAGES.map(({ key, label, emoji }) => (
          <div key={key} className="flex-shrink-0 w-64 mr-4">
            <SortableContext
              items={grouped[key]?.map((s) => s.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <StageColumn
                stage={key}
                label={`${emoji} ${label}`}
                submissions={grouped[key] || []}
              />
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  );
}

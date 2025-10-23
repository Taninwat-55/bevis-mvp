import { useMemo, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
  type CollisionDetection,
} from "@dnd-kit/core";
import { updateHiringStage } from "@/lib/api/mutations";
import toast from "react-hot-toast";
import type { EmployerSubmission, HiringStage } from "@/types";
import StageColumn from "./StageColumn";
import CandidateCard from "./CandidateCard";

interface TalentBoardProps {
  submissions: EmployerSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<EmployerSubmission[]>>;
}

const STAGES: { key: HiringStage; label: string; emoji: string }[] = [
  { key: "new", label: "New", emoji: "🆕" },
  { key: "shortlisted", label: "Shortlisted", emoji: "⭐" },
  { key: "interview", label: "Interview", emoji: "💬" },
  { key: "hold", label: "On Hold", emoji: "⏸" },
  { key: "hired", label: "Hired", emoji: "🎉" },
  { key: "rejected", label: "Rejected", emoji: "❌" },
];

// 🧭 Custom collision: prioritize columns over cards
const collisionDetectionStrategy: CollisionDetection = (args) => {
  const intersections = rectIntersection(args);
  if (intersections.length > 0) {
    const droppable = intersections.find(
      (i) => i.data?.droppableContainer?.data?.current?.stage
    );
    return droppable ? [droppable] : [intersections[0]];
  }
  return [];
};

export default function TalentBoard({
  submissions,
  setSubmissions,
}: TalentBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const [activeId, setActiveId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Record<HiringStage, EmployerSubmission[]> = {
      new: [],
      shortlisted: [],
      interview: [],
      hold: [],
      hired: [],
      rejected: [],
    };
    for (const s of submissions) {
      const stage = (s.hiring_stage ?? "new") as HiringStage;
      groups[stage].push(s);
    }
    return groups;
  }, [submissions]);

  const activeItem = activeId
    ? submissions.find((s) => s.id === activeId) ?? null
    : null;

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeId = String(active.id);
    const destinationStage = over.data.current?.stage as
      | HiringStage
      | undefined;
    if (!destinationStage) return;

    const dragged = submissions.find((s) => s.id === activeId);
    if (!dragged || dragged.hiring_stage === destinationStage) return;

    // Optimistic UI
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === activeId ? { ...s, hiring_stage: destinationStage } : s
      )
    );

    try {
      await updateHiringStage(
        activeId,
        destinationStage,
        dragged.employer_notes ?? ""
      );
      toast.success(`Moved to ${destinationStage}`);
    } catch {
      toast.error("Failed to update stage");
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === activeId ? { ...s, hiring_stage: dragged.hiring_stage } : s
        )
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex overflow-x-auto gap-x-4 px-6 py-2 snap-x snap-mandatory">
        {STAGES.map(({ key, label, emoji }) => (
          <StageColumn
            key={key}
            stage={key}
            label={`${emoji} ${label}`}
            submissions={grouped[key]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="cursor-grabbing scale-[1.02] opacity-90">
            <CandidateCard submission={activeItem} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

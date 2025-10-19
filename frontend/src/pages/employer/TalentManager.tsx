import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getEmployerSubmissionsWithFeedback } from "@/lib/api/submissions";
import type { EmployerSubmission } from "@/types";
import toast from "react-hot-toast";
import { Loader2, Users } from "lucide-react";
import TalentBoard from "@/components/talent/TalentBoard";

export default function TalentManager() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<EmployerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    async function load() {
      try {
        setLoading(true);
        const data = await getEmployerSubmissionsWithFeedback(user!.id);
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load candidates");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[var(--color-text-muted)]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-lg text-[var(--color-employer-dark)] flex items-center gap-2">
            <Users size={20} /> Talent Manager
          </h1>
          <p className="text-[var(--color-text-muted)]">
            Manage candidates across your hiring stages.
          </p>
        </div>
      </header>

      <TalentBoard submissions={submissions} setSubmissions={setSubmissions} />
    </div>
  );
}

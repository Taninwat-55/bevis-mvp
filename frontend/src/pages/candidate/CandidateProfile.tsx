// src/pages/candidate/CandidateProfile.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
// import { useProofs } from "@/hooks/useProofs";
import ProofCardsGrid from "@/components/ProofCardsGrid";

interface ProfileStats {
  proofsCompleted: number;
  avgScore: number;
  jobsApplied: number;
}

export default function CandidateProfile() {
  const { user } = useAuth();
  console.log(user?.role);
  const [stats, setStats] = useState<ProfileStats>({
    proofsCompleted: 0,
    avgScore: 0,
    jobsApplied: 0,
  });
  const [joined, setJoined] = useState<string>("");
  // const { cards, credits } = useProofs();

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      // 🕓 Fetch join date
      const { data: userData } = await supabase
        .from("users")
        .select("created_at")
        .eq("id", user.id)
        .single();
      if (userData?.created_at)
        setJoined(new Date(userData.created_at).toLocaleDateString());

      // 📊 Fetch stats
      const { count: completed } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "reviewed");

      const { data: scored } = await supabase
        .from("submissions")
        .select("score")
        .eq("user_id", user.id)
        .not("score", "is", null);

      const { count: applied } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const avgScore =
        scored && scored.length
          ? scored.reduce((a, c) => a + (c.score ?? 0), 0) / scored.length
          : 0;

      setStats({
        proofsCompleted: completed || 0,
        avgScore: Number(avgScore.toFixed(1)),
        jobsApplied: applied || 0,
      });
    })();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-10">
        <h1 className="heading-lg">👤 My Profile</h1>
        <p className="body-base mt-1 text-[var(--color-text-muted)]">
          View your account details and performance summary.
        </p>
      </header>

      <section className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6 mb-8">
        <h2 className="heading-md mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user?.role}</span>
          </p>
          <p>
            <strong>Member Since:</strong> {joined || "—"}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6">
        <h2 className="heading-md mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Proofs Completed" value={stats.proofsCompleted} />
          <StatCard label="Average Score" value={`${stats.avgScore}★`} />
          <StatCard label="Jobs Applied" value={stats.jobsApplied} />
        </div>
      </section>

      <section className="mt-8 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6">
        <h2 className="heading-md mb-4">My Proof Cards</h2>
        <ProofCardsGrid />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-[var(--radius-card)] text-center border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <div className="text-3xl font-semibold text-[var(--color-candidate)] mb-1">
        {value}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

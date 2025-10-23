// src/pages/candidate/CandidateDashboard.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { Info, CreditCard } from "lucide-react";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    proofsCompleted: 0,
    avgScore: 0,
    jobsApplied: 0,
  });
  const [credits, setCredits] = useState<number>(0);

  // 🪙 Fetch credits from profile
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setCredits(data?.credits ?? 0));
  }, [user?.id]);

  // 📊 Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

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
          ? scored.reduce((acc, cur) => acc + (cur.score ?? 0), 0) /
            scored.length
          : 0;

      setStats({
        proofsCompleted: completed || 0,
        avgScore: Number(avgScore.toFixed(1)),
        jobsApplied: applied || 0,
      });
    };

    fetchStats();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-10">
        <h1 className="heading-lg">
          👋 Hi {user?.email?.split("@")[0]}, ready to prove yourself?
        </h1>
        <p className="body-base mt-1">
          Here’s a quick look at your performance and progress.
        </p>
      </header>

      {/* 🌟 Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-12">
        {/* 🪙 Highlighted Credits card */}
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] bg-[var(--color-candidate)]/10 hover:bg-[var(--color-candidate)]/20 transition group">
          <div className="absolute top-2 right-2 text-[var(--color-candidate)]/50">
            <CreditCard size={18} />
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-[var(--color-candidate)] mb-1">
              💳 {credits}
            </div>
            <div className="flex justify-center items-center gap-1">
              <span className="text-sm font-medium text-[var(--color-text)]">
                Credits
              </span>
              <div className="relative">
                <Info
                  size={14}
                  className="text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-candidate)]"
                />
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max
                     bg-[var(--color-surface)] text-[var(--color-text)] text-xs 
                     border border-[var(--color-border)] rounded px-2 py-1 
                     shadow-[var(--shadow-soft)] opacity-0 group-hover:opacity-100
                     transition pointer-events-none whitespace-nowrap"
                >
                  Earn more credits by completing high-rated proof tasks
                </div>
              </div>
            </div>
            <p className="text-xs mt-1 text-[var(--color-text-muted)]">
              Earned through high-rated proofs
            </p>
          </div>
        </div>

        <StatCard label="Proofs Completed" value={stats.proofsCompleted} />
        <StatCard label="Average Score" value={`${stats.avgScore || "–"}★`} />
        <StatCard label="Jobs Applied" value={stats.jobsApplied} />
      </section>

      {/* 🔗 Quick Access */}
      <section>
        <h2 className="heading-md mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/candidate/jobs"
            className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition"
          >
            <h3 className="font-medium text-[var(--color-text)] mb-1">
              Browse Jobs
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Find proof tasks that fit your skills
            </p>
          </Link>
          <Link
            to="/candidate/proofs"
            className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition"
          >
            <h3 className="font-medium text-[var(--color-text)] mb-1">
              My Proofs
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              See your submissions and feedback
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] text-center transition hover:shadow-md">
      <div className="text-3xl font-semibold text-[var(--color-candidate)] mb-1">
        {value}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

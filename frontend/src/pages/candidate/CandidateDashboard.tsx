import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    proofsCompleted: 0,
    avgScore: 0,
    jobsApplied: 0,
  });

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
        <p className="body-base mt-1">Here’s a quick look at your progress.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <StatCard label="Proofs Completed" value={stats.proofsCompleted} />
        <StatCard label="Average Score" value={`${stats.avgScore || "–"}★`} />
        <StatCard label="Jobs Applied" value={stats.jobsApplied} />
      </section>

      <section>
        <h2 className="heading-md mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/candidate/jobs"
            className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] hover:shadow-[var(--shadow-hover)] transition"
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
            className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] hover:shadow-[var(--shadow-hover)] transition"
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
    <div className="bg-white p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] text-center">
      <div className="text-3xl font-semibold text-[var(--color-candidate)] mb-1">
        {value}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

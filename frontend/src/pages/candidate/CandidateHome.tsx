import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useCandidateStats } from "@/hooks/useCandidateStats";

export default function CandidateHome() {
  const { user } = useAuth();
  const { proofsCompleted, avgScore, jobsApplied, credits, loading } =
    useCandidateStats();

  if (loading)
    return (
      <div className="p-8 text-center text-[var(--color-text-muted)]">
        Loading dashboard…
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      {/* 👋 Header Banner */}
      <header className="mb-10">
        <div className="mb-8 bg-gradient-to-r from-[var(--color-candidate)]/10 to-transparent border border-[var(--color-border)] rounded-[var(--radius-card)] p-6">
          <h1 className="heading-md text-[var(--color-candidate-dark)] mb-1">
            👋 Welcome back, {user?.email?.split("@")[0] || "Candidate"}!
          </h1>
          <p className="body-base mt-1 text-[var(--color-text-muted)]">
            Continue your proof journey — explore tasks, review feedback, and
            grow your verified record.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            You currently have <strong>{credits}</strong> proof credits.
          </p>
        </div>
      </header>

      {/* 📊 Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Proofs Completed" value={proofsCompleted} />
        <StatCard
          label="Average Score"
          value={avgScore ? `${avgScore}★` : "—"}
        />
        <StatCard label="Jobs Applied" value={jobsApplied} />
      </section>

      {/* 🎯 Action Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="🎯 Explore Proof Tasks"
          desc="Browse available roles and challenges that match your skills."
          href="/jobs"
        />
        <ActionCard
          title="🧾 View Feedback"
          desc="Check employer ratings and feedback to improve your next submission."
          href="/candidate/proofs"
        />
        <ActionCard
          title="📄 Update Profile"
          desc="Keep your information up-to-date and strengthen your credibility."
          href="/candidate/profile"
        />
      </section>
    </div>
  );
}

/* ─── Subcomponents ─────────────────────────────── */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] text-center">
      <div className="text-2xl font-semibold text-[var(--color-candidate-dark)] mb-1">
        {value}
      </div>
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6 hover:shadow-md transition-all">
      <h2 className="font-semibold mb-2 text-[var(--color-text)]">{title}</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">{desc}</p>
      <Link
        to={href}
        className="text-[var(--color-candidate-dark)] font-medium hover:underline"
      >
        Go →
      </Link>
    </div>
  );
}

// src/pages/employer/EmployerHome.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function EmployerHome() {
  const { user } = useAuth();

  const [jobsPosted, setJobsPosted] = useState(0);
  const [activeSubmissions, setActiveSubmissions] = useState(0);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchStats = async () => {
      try {
        // 1️⃣ Count jobs posted by employer
        const { count: jobCount } = await supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("employer_id", user.id);

        // 2️⃣ Get employer submissions for those jobs
        const { data: jobIds } = await supabase
          .from("jobs")
          .select("id")
          .eq("employer_id", user.id);

        const jobIdList = jobIds?.map((j) => j.id) || [];

        let submissionCount = 0;
        let feedbackScores: number[] = [];
        let latestSubs: any[] = [];

        if (jobIdList.length > 0) {
          // Count active submissions
          const { count } = await supabase
            .from("submissions")
            .select("*", { count: "exact", head: true })
            .in("job_id", jobIdList)
            .eq("status", "submitted");
          submissionCount = count || 0;

          // Fetch submissions + feedback
          const { data: recent } = await supabase
            .from("submissions")
            .select(
              `
              id,
              user_id,
              job_id,
              created_at,
              proof_tasks ( title ),
              feedback ( stars )
            `
            )
            .in("job_id", jobIdList)
            .order("created_at", { ascending: false })
            .limit(3);

          latestSubs = recent || [];

          // Compute average rating
          const ratings =
            recent
              ?.flatMap((s) => s.feedback?.map((f) => f.stars))
              .filter((r): r is number => typeof r === "number") || [];
          if (ratings.length) {
            feedbackScores = ratings;
          }
        }

        setJobsPosted(jobCount || 0);
        setActiveSubmissions(submissionCount);
        setAvgScore(
          feedbackScores.length
            ? Number(
                (
                  feedbackScores.reduce((a, b) => a + b, 0) /
                  feedbackScores.length
                ).toFixed(1)
              )
            : null
        );
        setSubmissions(latestSubs);
      } catch (err) {
        console.error("Error fetching employer home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (loading)
    return (
      <div className="p-8 text-center text-[var(--color-text-muted)]">
        Loading dashboard…
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      {/* 🏠 Header */}
      <header className="mb-10">
        <div className="mb-8 bg-gradient-to-r from-[var(--color-employer)]/10 to-transparent border border-[var(--color-border)] rounded-[var(--radius-card)] p-6">
          <h1 className="heading-md text-[var(--color-employer-dark)] mb-1">
            👋 Welcome back, {user?.email?.split("@")[0]}!
          </h1>
          <p className="body-base mt-1 text-[var(--color-text-muted)]">
            Manage your hiring workflow, review proofs, and discover top talent.
          </p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            You have <strong>{activeSubmissions}</strong> submissions awaiting
            review.
          </p>
        </div>
      </header>

      {/* 📊 Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Jobs Posted" value={jobsPosted} />
        <StatCard label="Active Submissions" value={activeSubmissions} />
        <StatCard
          label="Avg Feedback Score"
          value={avgScore ? `${avgScore}★` : "—"}
        />
      </section>

      {/* 🧩 Recent Submissions */}
      <section className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] mb-10">
        <h2 className="heading-md mb-3">Recent Submissions</h2>
        {submissions.length ? (
          <ul className="divide-y divide-[var(--color-border)]">
            {submissions.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <span className="font-medium">{s.proof_tasks?.title}</span> from{" "}
                <span className="text-[var(--color-text-muted)]">
                  {s.user_id}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[var(--color-text-muted)] text-sm">
            No new submissions yet.
          </p>
        )}
      </section>

      {/* 🔗 Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="💼 Post a Job"
          desc="Create a new proof-based task and start collecting candidate submissions."
          href="/employer/jobs/new"
        />
        <ActionCard
          title="🧠 Review Submissions"
          desc="Evaluate candidate proofs and provide structured feedback."
          href="/employer/submissions"
        />
        <ActionCard
          title="🌟 Explore Talent Pool"
          desc="Browse verified candidates with strong proof records."
          href="/employer/talent"
        />
      </section>
    </div>
  );
}

/* ─── Subcomponents ─────────────────────────────── */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] text-center">
      <div className="text-2xl font-semibold text-[var(--color-employer-dark)] mb-1">
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
        className="text-[var(--color-employer-dark)] font-medium hover:underline"
      >
        Go →
      </Link>
    </div>
  );
}

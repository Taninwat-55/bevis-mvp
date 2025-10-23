// src/pages/employer/EmployerHome.tsx
import HomeLayout from "@/layout/HomeLayout";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export default function EmployerHome() {
  const { user } = useAuth();

  return (
    <HomeLayout
      accentColor="var(--color-employer-dark)"
      title={`👋 Welcome back, ${user?.email?.split("@")[0] || "Employer"}!`}
      subtitle="Manage your hiring workflow, review proofs, and discover top talent."
    >
      <Card
        title="💼 Post a Job"
        desc="Create a new proof-based task and start collecting candidate submissions."
        href="/employer/jobs/new"
      />
      <Card
        title="🧠 Review Submissions"
        desc="Evaluate proofs and provide structured feedback to candidates."
        href="/employer/dashboard"
      />
      <Card
        title="🌟 Explore Talent Pool"
        desc="Browse verified candidates with strong proof records."
        href="/employer/talent"
      />
    </HomeLayout>
  );
}

function Card({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] transition-colors">
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

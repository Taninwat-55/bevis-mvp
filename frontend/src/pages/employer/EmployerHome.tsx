// src/pages/employer/EmployerHome.tsx
import HomeLayout from "@/components/layout/HomeLayout";
import { useAuth } from "@/hooks/useAuth";

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
        href="/employer/post"
      />
      <Card
        title="🧠 Review Submissions"
        desc="Evaluate proofs and provide structured feedback to candidates."
        href="/employer/submissions"
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
    <div className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <h2 className="font-semibold mb-2 text-[var(--color-text)]">{title}</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-4">{desc}</p>
      <a
        href={href}
        className="text-[var(--color-employer-dark)] font-medium hover:underline"
      >
        Go →
      </a>
    </div>
  );
}

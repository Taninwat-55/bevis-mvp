// src/pages/candidate/CandidateHome.tsx
import HomeLayout from "@/components/layout/HomeLayout";
import { useAuth } from "@/hooks/useAuth";

export default function CandidateHome() {
  const { user } = useAuth();

  return (
    <HomeLayout
      accentColor="var(--color-candidate-dark)"
      title={`👋 Welcome back, ${user?.email?.split("@")[0] || "Candidate"}!`}
      subtitle="Continue your proof journey — explore tasks, review feedback, and grow your skill record."
    >
      <Card
        title="🎯 Explore Proof Tasks"
        desc="Browse available roles and challenges that match your skills."
        href="/jobs"
      />
      <Card
        title="🧾 View Feedback"
        desc="Check employer ratings and feedback to improve your next submission."
        href="/proofs"
      />
      <Card
        title="📄 Update Profile"
        desc="Keep your information up-to-date and strengthen your credibility."
        href="/profile"
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
        className="text-[var(--color-candidate-dark)] font-medium hover:underline"
      >
        Go →
      </a>
    </div>
  );
}

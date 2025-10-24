import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  Award,
  Upload,
  Eye,
  Star,
  Repeat,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export default function LearnMorePage() {
  const [mode, setMode] = useState<"candidate" | "employer">("candidate");

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* 🧭 Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-16 text-center">
        <h1 className="heading-lg mb-3">Learn How Bevis Works</h1>
        <p className="body-base text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Discover how Bevis empowers both candidates and employers through
          verified, proof-based hiring — where skill replaces guesswork.
        </p>

        {/* Toggle */}
        <div className="inline-flex border border-[var(--color-border)] rounded-[var(--radius-button)] overflow-hidden mt-8">
          <button
            onClick={() => setMode("candidate")}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              mode === "candidate"
                ? "bg-[var(--color-candidate)] text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            🎓 For Candidates
          </button>
          <button
            onClick={() => setMode("employer")}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              mode === "employer"
                ? "bg-[var(--color-employer)] text-white"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            🏢 For Employers
          </button>
        </div>
      </header>

      {/* 🧩 Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {mode === "candidate" ? <CandidateGuide /> : <EmployerGuide />}
      </main>

      {/* 🚀 CTA */}
      <footer className="text-center border-t border-[var(--color-border)] py-16 bg-[var(--color-surface)]">
        <h2 className="heading-md mb-4">
          Ready to experience proof-based hiring?
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/auth?role=candidate"
            className="px-5 py-3 rounded-[var(--radius-button)] bg-[var(--color-candidate)] text-white hover:brightness-110 transition"
          >
            Create My Proof Profile
          </Link>
          <Link
            to="/auth?role=employer"
            className="px-5 py-3 rounded-[var(--radius-button)] bg-[var(--color-employer)] text-white hover:brightness-110 transition"
          >
            Post a Role
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────── CANDIDATE GUIDE ─────────────────────────────── */
function CandidateGuide() {
  const steps = [
    {
      icon: Briefcase,
      title: "1. Apply",
      text: "Pick a role and complete a short, real-world proof task instead of sending a CV.",
    },
    {
      icon: CheckCircle2,
      title: "2. Prove",
      text: "Submit your work — employers review what you can actually do, not what you claim.",
    },
    {
      icon: Award,
      title: "3. Earn Proof",
      text: "Receive verified feedback, earn credits, and strengthen your public proof profile.",
    },
  ];

  return (
    <>
      {/* Workflow */}
      <h2 className="heading-md mb-6 text-center">How Candidates Use Bevis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:shadow-md transition-all flex flex-col items-start text-left"
          >
            <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* Proof Loop */}
      <section className="text-center border-t border-[var(--color-border)] pt-12 mt-12">
        <Repeat size={32} className="mx-auto mb-4 opacity-80" />
        <h3 className="heading-sm mb-2">The Proof Loop</h3>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm">
          Each submission becomes a verified record. You complete a task →
          employer reviews it → feedback is stored as part of your skill
          profile. Over time, your profile becomes living proof of your
          experience.
        </p>
      </section>

      {/* Fairness */}
      <section className="text-center border-t border-[var(--color-border)] pt-12 mt-12">
        <ShieldCheck size={32} className="mx-auto mb-4 opacity-80" />
        <h3 className="heading-sm mb-2">Fairness & Transparency</h3>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm">
          Bevis removes résumé bias by focusing on output, not background.
          Everyone sees the same tasks, the same scoring, and the same
          opportunity — no matter their degree or connections.
        </p>
      </section>

      {/* FAQ */}
      <section className="text-center border-t border-[var(--color-border)] pt-12 mt-12">
        <HelpCircle size={28} className="mx-auto mb-4 opacity-80" />
        <h3 className="heading-sm mb-2">Common Questions</h3>
        <ul className="max-w-2xl mx-auto text-left text-sm text-[var(--color-text-muted)] space-y-3">
          <li>
            <strong>• What’s a proof task?</strong>
            <p>
              It’s a short, real project designed to demonstrate your ability in
              context — not a test, but a small piece of real work.
            </p>
          </li>
          <li>
            <strong>• Is Bevis free?</strong>
            <p>
              Yes. You can join, complete proof tasks, and earn verified records
              for free.
            </p>
          </li>
          <li>
            <strong>• Can I share my proofs?</strong>
            <p>
              Yes — your verified proofs appear in your public profile, ready to
              share with employers anywhere.
            </p>
          </li>
        </ul>
      </section>

      <div className="mt-10 text-center">
        <Link
          to="/jobs"
          className="text-[var(--color-candidate-dark)] font-medium hover:underline"
        >
          Browse Proof Tasks →
        </Link>
      </div>
    </>
  );
}

/* ─────────────────────────────── EMPLOYER GUIDE ─────────────────────────────── */
function EmployerGuide() {
  const steps = [
    {
      icon: Upload,
      title: "1. Post a Role",
      text: "Describe your job and Bevis helps generate a relevant micro-proof task.",
    },
    {
      icon: Eye,
      title: "2. Review Proofs",
      text: "Assess candidate submissions fairly — you see authentic work, not buzzwords.",
    },
    {
      icon: Star,
      title: "3. Hire & Feature",
      text: "Hire confidently and optionally feature your company as a verified employer.",
    },
  ];

  return (
    <>
      {/* Workflow */}
      <h2 className="heading-md mb-6 text-center">How Employers Use Bevis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:shadow-md transition-all flex flex-col items-start text-left"
          >
            <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* Proof Loop */}
      <section className="text-center border-t border-[var(--color-border)] pt-12 mt-12">
        <Repeat size={32} className="mx-auto mb-4 opacity-80" />
        <h3 className="heading-sm mb-2">The Proof Loop</h3>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm">
          Employers create proof tasks → candidates complete them → you review
          real work → verified results build the candidate’s record. This closes
          the loop between education and employment.
        </p>
      </section>

      {/* Fairness */}
      <section className="text-center border-t border-[var(--color-border)] pt-12 mt-12">
        <ShieldCheck size={32} className="mx-auto mb-4 opacity-80" />
        <h3 className="heading-sm mb-2">Fair Hiring Made Simple</h3>
        <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto text-sm">
          Bevis helps you hire based on skill, not résumé noise. Every proof is
          traceable, reviewed, and fair — giving you confidence that you’re
          hiring genuine talent.
        </p>
      </section>

      {/* FAQ */}
      <section className="text-center border-t border-[var(--color-border)] pt-12 mt-12">
        <HelpCircle size={28} className="mx-auto mb-4 opacity-80" />
        <h3 className="heading-sm mb-2">Common Questions</h3>
        <ul className="max-w-2xl mx-auto text-left text-sm text-[var(--color-text-muted)] space-y-3">
          <li>
            <strong>• How do I post a job?</strong>
            <p>
              Create an employer account, add your job details, and Bevis guides
              you through creating a matching proof task.
            </p>
          </li>
          <li>
            <strong>• Can I review anonymously?</strong>
            <p>
              Yes, your company identity can remain private during early reviews
              if preferred.
            </p>
          </li>
          <li>
            <strong>• How do I feature my company?</strong>
            <p>
              Verified employers can feature roles on the homepage for extra
              visibility.
            </p>
          </li>
        </ul>
      </section>

      <div className="mt-10 text-center">
        <Link
          to="/auth?role=employer"
          className="text-[var(--color-employer-dark)] font-medium hover:underline"
        >
          Start Posting →
        </Link>
      </div>
    </>
  );
}

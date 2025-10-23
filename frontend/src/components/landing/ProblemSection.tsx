// src/components/landing/ProblemSection.tsx
import { motion } from "framer-motion";

export default function ProblemSection() {
  const problems = [
    {
      icon: "🧾",
      title: "Résumé Bias",
      text: "Hiring decisions still rely on self-promotion, not skill. Great talent is overlooked every day.",
    },
    {
      icon: "⏳",
      title: "Slow & Unreliable Hiring",
      text: "Endless interviews and tests that don’t predict performance — wasting time for both sides.",
    },
    {
      icon: "🔍",
      title: "No Proof of Ability",
      text: "Employers guess. Candidates over-explain. Proof brings clarity to both sides instantly.",
    },
  ];

  return (
    <section id="problems" className="bg-[var(--color-bg)] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.h2
          role="heading"
          aria-level={2}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="heading-lg mb-4"
        >
          Why the Old Way Doesn’t Work
        </motion.h2>

        <p className="body-base max-w-2xl mx-auto mb-16">
          Traditional hiring is broken. Résumés create bias, slow processes, and
          endless uncertainty. Bevis replaces guesswork with evidence.
        </p>

        <div className="grid gap-10 md:grid-cols-3 text-left">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                {p.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

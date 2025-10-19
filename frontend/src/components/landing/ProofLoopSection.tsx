import { motion } from "framer-motion";

const steps = [
  {
    emoji: "🧩",
    title: "Complete a Proof Task",
    desc: "Apply by solving a real challenge that reflects the actual work.",
  },
  {
    emoji: "🧠",
    title: "Get Reviewed",
    desc: "Employers evaluate your submission and leave structured feedback.",
  },
  {
    emoji: "🏅",
    title: "Earn Proof of Skill",
    desc: "Successful proofs become verified badges on your Bevis profile.",
  },
];

export default function ProofLoopSection() {
  return (
    <section
      id="proof-loop"
      className="py-24 px-6 bg-[var(--color-bg)] text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-14">
        The Proof-Based Hiring Loop
      </h2>
      <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map(({ emoji, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--color-surface)] transition-colors p-8 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition"
          >
            <div className="text-4xl mb-4">{emoji}</div>
            <h3 className="font-semibold text-lg mb-3">{title}</h3>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

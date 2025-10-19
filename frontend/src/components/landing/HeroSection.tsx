import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative text-center flex flex-col items-center justify-center min-h-[85vh] px-6 bg-[var(--color-surface)] border-b border-[var(--color-border)] transition-colors">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-[var(--color-text)]"
      >
        Proof{" "}
        <span className="text-[var(--color-candidate-dark)] dark:text-[var(--color-candidate)]">
          over
        </span>{" "}
        pedigree.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl text-lg md:text-xl text-[var(--color-text-muted)] mb-10"
      >
        Bevis complements your CV with verified proof of skills — show what you
        can do, not just where you studied.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <a
          href="/auth"
          className="px-6 py-3 rounded-[var(--radius-button)] bg-[var(--color-candidate-dark)] text-white font-medium hover:bg-[var(--color-candidate)] transition"
        >
          🎓 Join as Candidate
        </a>
        <a
          href="/auth"
          className="px-6 py-3 rounded-[var(--radius-button)] bg-[var(--color-employer-dark)] text-white font-medium hover:bg-[var(--color-employer)] transition"
        >
          🏢 Hire by Proof
        </a>
      </motion.div>
    </section>
  );
}

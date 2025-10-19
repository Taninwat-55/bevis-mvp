// src/components/landing/HeroSection.tsx
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center py-32 px-6 overflow-hidden">
      {/* Background gradient blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-candidate-light)]/30 via-transparent to-[var(--color-employer-light)]/40 blur-3xl opacity-40 -z-10" />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
      >
        Proof <span className="text-[var(--color-candidate-dark)]">over</span>{" "}
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

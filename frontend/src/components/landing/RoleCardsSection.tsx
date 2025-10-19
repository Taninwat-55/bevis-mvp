import { motion } from "framer-motion";

export default function RoleCardsSection() {
  const roles = [
    {
      title: "🎓 For Candidates",
      desc: "Turn every challenge into experience. Build credibility with real proof of work.",
      color: "var(--color-candidate-dark)",
      href: "/auth",
      cta: "Start Proving →",
    },
    {
      title: "🏢 For Employers",
      desc: "Hire with confidence. Replace resumes with hands-on proof of skill.",
      color: "var(--color-employer-dark)",
      href: "/auth",
      cta: "Post a Job →",
    },
  ];

  return (
    <section
      id="roles"
      className="py-24 px-6 bg-[var(--color-surface)] transition-colors border-t border-[var(--color-border)]"
    >
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-10">
        {roles.map(({ title, desc, color, href, cta }) => (
          <motion.a
            key={title}
            href={href}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="block p-10 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition"
          >
            <h3 className="text-2xl font-semibold mb-4" style={{ color }}>
              {title}
            </h3>
            <p className="text-[var(--color-text-muted)] mb-6 text-base">
              {desc}
            </p>
            <span
              className="font-medium hover:underline text-base"
              style={{ color }}
            >
              {cta}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

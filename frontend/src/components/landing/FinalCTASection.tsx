export default function FinalCTASection() {
  return (
    <section className="py-24 px-6 text-center bg-[var(--color-bg)] border-t border-[var(--color-border)] transition-colors">
      <h2 className="text-4xl font-bold mb-4 text-[var(--color-text)]">
        Ready to start proving?
      </h2>
      <p className="mb-10 max-w-xl mx-auto text-lg text-[var(--color-text-muted)]">
        Build credibility. Discover talent. Join the proof revolution.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <a
          href="/auth"
          className="px-8 py-3 rounded-[var(--radius-button)] bg-[var(--color-candidate-dark)] text-white font-medium hover:bg-[var(--color-candidate)] transition"
        >
          🎓 Join as Candidate
        </a>
        <a
          href="/auth"
          className="px-8 py-3 rounded-[var(--radius-button)] bg-[var(--color-employer-dark)] text-white font-medium hover:bg-[var(--color-employer)] transition"
        >
          🏢 Post a Job
        </a>
      </div>
    </section>
  );
}

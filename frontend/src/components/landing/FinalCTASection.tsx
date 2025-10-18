export default function FinalCTASection() {
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-br from-[var(--color-candidate-dark)] via-[var(--color-candidate)] to-[var(--color-employer-dark)] text-white relative overflow-hidden">
      {/* Glow overlay */}
      <div className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
      <div className="relative z-10">
        <h2 className="text-4xl font-bold mb-4">Ready to start proving?</h2>
        <p className="text-white/80 mb-10 max-w-xl mx-auto text-lg">
          Build credibility. Discover talent. Join the proof revolution.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/auth"
            className="px-8 py-3 rounded-[var(--radius-button)] bg-white text-[var(--color-candidate-dark)] font-medium hover:bg-gray-100 transition"
          >
            🎓 Join as Candidate
          </a>
          <a
            href="/auth"
            className="px-8 py-3 rounded-[var(--radius-button)] bg-white text-[var(--color-employer-dark)] font-medium hover:bg-gray-100 transition"
          >
            🏢 Post a Job
          </a>
        </div>
      </div>
    </section>
  );
}

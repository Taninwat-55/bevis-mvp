import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text)]">
          Prove your skills.{" "}
          <span className="text-[var(--color-candidate)]">Get hired.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl body-base">
          Bevis replaces CV-based hiring with proof-based hiring — where real
          work speaks louder than résumés.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/auth?role=candidate"
            className="rounded-[var(--radius-button)] px-5 py-3 bg-[var(--color-candidate)] text-white hover:brightness-110 transition shadow-[var(--shadow-soft)]"
          >
            Create my Proof Profile
          </Link>
          <Link
            to="/auth?role=employer"
            className="rounded-[var(--radius-button)] px-5 py-3 bg-[var(--color-employer)] text-white hover:brightness-110 transition shadow-[var(--shadow-soft)]"
          >
            Post a Role
          </Link>
        </div>
      </div>
    </section>
  );
}

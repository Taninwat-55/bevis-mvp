import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/jobs?query=${encodeURIComponent(search.trim())}`);
  };

  return (
    <section className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        {/* 🧠 Headline + Tagline */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text)]">
          Prove your skills.{" "}
          <span className="text-[var(--color-candidate)]">Get hired.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl body-base text-[var(--color-text-muted)]">
          Bevis reimagines hiring by giving candidates the choice to prove their
          skills — where verified work can speak alongside their CV.
        </p>

        {/* 🔍 Search bar */}
        <form
          onSubmit={handleSubmit}
          className="relative max-w-xl mx-auto mt-10 mb-6"
        >
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, categories, or skills..."
            className="w-full rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-candidate)]"
          />
        </form>

        {/* 🏷️ Quick categories (optional) */}
        <div className="flex flex-wrap justify-center gap-3 text-sm mb-10">
          {["Frontend", "UI/UX", "Marketing", "Data", "Writing"].map((cat) => (
            <button
              key={cat}
              onClick={() =>
                navigate(`/jobs?category=${encodeURIComponent(cat)}`)
              }
              className="px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-candidate-dark)] hover:border-[var(--color-candidate-dark)] transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🚀 CTA buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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

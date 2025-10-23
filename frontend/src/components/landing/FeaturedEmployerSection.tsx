// src/components/landing/FeaturedEmployerSection.tsx
import { useEffect, useState } from "react";
import { getFeaturedJobs } from "@/lib/api/jobs";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import type { FeaturedJob } from "@/types";

export default function FeaturedEmployersSection() {
  const [jobs, setJobs] = useState<FeaturedJob[]>([]);

  useEffect(() => {
    getFeaturedJobs().then(setJobs).catch(console.error);
  }, []);

  if (!jobs.length) return null;

  return (
    <section className="relative py-20 border-t border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* ✨ shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-employer)]/5 to-transparent animate-[shimmer_5s_linear_infinite]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <h2 className="heading-md mb-10 text-center flex items-center justify-center gap-2">
          <span>⭐ Featured Employers</span>
          <BadgeCheck
            size={20}
            className="text-[var(--color-employer)] drop-shadow-sm"
          />
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((j) => (
            <Link
              key={j.id}
              to={`/jobs/${j.id}`}
              className="group relative flex flex-col items-center text-center border border-[var(--color-border)]
                         rounded-[var(--radius-card)] bg-[var(--color-bg)] shadow-[var(--shadow-soft)]
                         hover:shadow-lg hover:-translate-y-1 transition transform p-8"
            >
              {/* Company “logo” circle */}
              <div
                className="w-16 h-16 flex items-center justify-center rounded-full
                           bg-[var(--color-employer)]/10 text-[var(--color-employer)]
                           font-semibold text-lg mb-3"
              >
                {j.company?.charAt(0) ?? "?"}
              </div>

              {/* Company name */}
              <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-employer)] mb-1 flex items-center justify-center gap-1">
                {j.company ?? "Untitled Company"}
                <BadgeCheck
                  size={15}
                  className="text-[var(--color-employer)] opacity-80"
                />
              </h3>

              {/* Job title */}
              <p className="text-sm text-[var(--color-text-muted)] mb-2">
                {j.title}
              </p>

              {/* Meta line */}
              <p className="text-xs text-[var(--color-text-muted)]">
                📍 {j.location ?? "Remote"} ·{" "}
                {new Date(j.created_at ?? "").toLocaleDateString()}
              </p>

              {/* subtle underline on hover */}
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--color-employer)]/0 group-hover:bg-[var(--color-employer)]/60 transition-all duration-300 rounded-b-[var(--radius-card)]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Briefcase, CheckCircle2, Award } from "lucide-react";

const items = [
  {
    icon: Briefcase,
    title: "Apply",
    text: "Pick a role and complete a short, real-world proof task.",
  },
  {
    icon: CheckCircle2,
    title: "Prove",
    text: "Submit your work. Employers review the output — not a résumé.",
  },
  {
    icon: Award,
    title: "Get Hired",
    text: "Earn a verified proof card and move forward based on evidence.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--color-surface)] py-20 border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12 text-center">
          <h2 className="heading-lg">How it works</h2>
          <p className="mt-3 body-base">
            Simple steps to turn skills into opportunities.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

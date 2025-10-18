export default function Footer() {
  return (
    <footer className="py-10 px-6 bg-white border-t border-[var(--color-border)] text-center">
      <p className="text-sm text-[var(--color-text-muted)] mb-3">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold">Bevis</span> · Proof-Based Hiring
      </p>
      <div className="flex justify-center gap-6 text-sm text-[var(--color-text-muted)]">
        <a href="#about" className="hover:text-[var(--color-text)]">
          About
        </a>
        <a href="#proof-loop" className="hover:text-[var(--color-text)]">
          How It Works
        </a>
        <a href="/auth" className="hover:text-[var(--color-text)]">
          Get Started
        </a>
      </div>
    </footer>
  );
}

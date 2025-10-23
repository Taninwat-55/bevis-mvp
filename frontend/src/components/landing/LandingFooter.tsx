export default function LandingFooter() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-8">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-[var(--color-text-muted)]">
            © {new Date().getFullYear()} Bevis. All rights reserved.
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#about"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              About
            </a>
            <a
              href="#how-it-works"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              How it works
            </a>
            <a
              href="#jobs"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Jobs
            </a>
            <a
              href="mailto:hello@bevis.test"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

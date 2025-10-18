// src/components/landing/TrustedBySection.tsx
export default function TrustedBySection() {
  const logos = [
    "/logos/brand1.svg",
    "/logos/brand2.svg",
    "/logos/brand3.svg",
    "/logos/brand4.svg",
  ]; // optional placeholders

  return (
    <section className="py-12 px-6 text-center">
      <p className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-6">
        Trusted by early adopters & forward-thinking teams
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt={`Brand ${i}`}
            className="h-8 w-auto grayscale opacity-70 hover:opacity-100 transition"
          />
        ))}
      </div>
    </section>
  );
}

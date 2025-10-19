// src/pages/landing/LandingPage.tsx
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ProofLoopSection from "@/components/landing/ProofLoopSection";
import RoleCardsSection from "@/components/landing/RoleCardsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors">
      <LandingNavbar />
      <main className="mt-16 flex flex-col">
        <HeroSection />
        <ProofLoopSection />
        <RoleCardsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}

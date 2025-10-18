// src/pages/landing/LandingPage.tsx
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ProofLoopSection from "@/components/landing/ProofLoopSection";
import RoleCardsSection from "@/components/landing/RoleCardsSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white via-[var(--color-bg)] to-white text-[var(--color-text)]">
      <LandingNavbar />
      <main className="mt-16 space-y-32">
        <HeroSection />
        {/* <TrustedBySection /> */}
        <ProofLoopSection />
        <RoleCardsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}

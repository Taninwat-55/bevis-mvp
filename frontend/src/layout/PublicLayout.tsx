// src/layout/PublicLayout.tsx
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <LandingNavbar />
      <ScrollToTop />
      <main className="flex-1">
        <Outlet />
      </main>
      <LandingFooter />
    </div>
  );
}

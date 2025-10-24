// src/pages/candidate/CandidateProfile.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import { useCandidateStats } from "@/hooks/useCandidateStats";
import ProofCardsGrid from "@/components/ProofCardsGrid";

export default function CandidateProfile() {
  const { user } = useAuth();
  const { proofsCompleted, avgScore, jobsApplied, credits, loading } =
    useCandidateStats();

  const [joined, setJoined] = useState<string>("");

  useEffect(() => {
    if (!user?.id) return;

    const fetchJoinDate = async () => {
      const { data } = await supabase
        .from("users")
        .select("created_at")
        .eq("id", user.id)
        .single();

      if (data?.created_at)
        setJoined(new Date(data.created_at).toLocaleDateString());
    };

    fetchJoinDate();
  }, [user?.id]);

  if (loading)
    return (
      <div className="p-8 text-center text-[var(--color-text-muted)]">
        Loading profile…
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      {/* 👤 Header */}
      <header className="mb-10">
        <h1 className="heading-lg">👤 My Profile</h1>
        <p className="body-base mt-1 text-[var(--color-text-muted)]">
          View your account details and performance summary.
        </p>
      </header>

      {/* 🧩 Account Info */}
      <section className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6 mb-8">
        <h2 className="heading-md mb-4">Account Information</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong>{" "}
            <span className="capitalize">{user?.role}</span>
          </p>
          <p>
            <strong>Member Since:</strong> {joined || "—"}
          </p>
          <p>
            <strong>Proof Credits:</strong> {credits ?? "—"}
          </p>
        </div>
      </section>

      {/* 📊 Performance Summary */}
      <section className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6">
        <h2 className="heading-md mb-4">Performance Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Proofs Completed" value={proofsCompleted} />
          <StatCard label="Average Score" value={`${avgScore || "—"}★`} />
          <StatCard label="Jobs Applied" value={jobsApplied} />
        </div>
      </section>

      {/* 💳 Proof Cards */}
      <section className="mt-8 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6">
        <h2 className="heading-md mb-4">My Proof Cards</h2>
        <ProofCardsGrid />
      </section>

      {/* 🌍 Public Profile Preview */}
      <section className="mt-8 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] p-6 text-center">
        <h2 className="heading-md mb-3">Public Profile</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          Share your Bevis proof record with potential employers or peers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="px-4 py-2 border border-[var(--color-border)] rounded-[var(--radius-button)] text-sm bg-[var(--color-bg)] break-all max-w-[90%]">
            {`${window.location.origin}/candidate/${user?.id}`}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/candidate/${user?.id}`
              );
              // optional: use your Notify util instead of toast
              import("react-hot-toast").then(({ default: toast }) =>
                toast.success("Profile link copied!")
              );
            }}
            className="text-sm px-4 py-2 bg-[var(--color-candidate)] text-white rounded-[var(--radius-button)] hover:brightness-110 transition"
          >
            Copy Link
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── Subcomponent ─────────────────────────────── */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-[var(--color-bg)] p-6 rounded-[var(--radius-card)] text-center border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
      <div className="text-3xl font-semibold text-[var(--color-candidate)] mb-1">
        {value}
      </div>
      <div className="text-sm text-[var(--color-text-muted)]">{label}</div>
    </div>
  );
}

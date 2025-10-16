// src/pages/employer/EmployerDashboard.tsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import { getEmployerJobs, getEmployerSubmissions } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import type { Tables } from "../../lib/Database";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Tables<"jobs">[]>([]);
  const [submissions, setSubmissions] = useState<
    (Tables<"submissions"> & { proof_tasks?: Tables<"proof_tasks"> })[]
  >([]);

  // 🧱 New job form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✨ Handle job creation
  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return toast.error("Please fill in all fields");
    setLoading(true);

    try {
      const { error } = await supabase
        .from("jobs")
        .insert([{ title, description }]);

      if (error) throw error;

      toast.success("✅ Job posted successfully!");
      setTitle("");
      setDescription("");

      // 🔄 Refresh job list
      const refreshed = await getEmployerJobs(user!.id);
      setJobs(refreshed);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  }

  // 📦 Load employer’s jobs + submissions on mount
  useEffect(() => {
    if (!user?.id) return;

    async function loadData() {
      try {
        const [j, s] = await Promise.all([
          getEmployerJobs(user.id),
          getEmployerSubmissions(user.id),
        ]);
        setJobs(j);
        setSubmissions(s);
      } catch (err) {
        console.error("Error fetching employer data:", err);
      }
    }

    loadData();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10 space-y-10">
      {/* 🧱 Post Job Form */}
      <section className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
        <h2 className="heading-md mb-4">Post a New Job</h2>
        <form onSubmit={handleAddJob} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
              placeholder="e.g., Junior Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm"
              rows={3}
              placeholder="Short summary of the role and proof task"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-employer)] text-white px-4 py-2 rounded-[var(--radius-button)] hover:bg-[var(--color-employer-dark)] transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </section>

      {/* 💼 Jobs List */}
      <section>
        <h2 className="heading-lg mb-6">Your Jobs</h2>
        <ul className="space-y-2 mb-10">
          {jobs.map((j) => (
            <li
              key={j.id}
              className="bg-white p-3 rounded-[var(--radius-card)] border border-[var(--color-border)]"
            >
              {j.title}
            </li>
          ))}
        </ul>
      </section>

      {/* 🧾 Proof Submissions */}
      <section>
        <h2 className="heading-lg mb-6">Proof Submissions</h2>
        <ul className="space-y-2">
          {submissions.map((s) => (
            <li
              key={s.id}
              className="bg-white p-3 rounded-[var(--radius-card)] border border-[var(--color-border)]"
            >
              <span className="font-medium">{s.proof_tasks?.title}</span>
              <span className="ml-2 text-[var(--color-text-muted)]">
                {s.status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import { supabase } from "../supabaseClient";
import type {
  AdminStats,
  BevisUser,
  AdminJob,
  AdminFeedback,
} from "../../types/admin";

// 🧾 Fetch all users
export async function getAllUsers(): Promise<BevisUser[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Normalize possible nulls to empty strings
  return (
    data?.map((u) => ({
      id: u.id,
      email: u.email ?? "", // 🩹 fallback
      role: u.role as BevisUser["role"],
      created_at: u.created_at ?? new Date().toISOString(),
    })) ?? []
  );
}

// 🧾 Fetch all jobs with employer info
export async function getAllJobs(): Promise<AdminJob[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
      id,
      title,
      status,
      company,
      location,
      created_at,
      users!employer_id ( email )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  // ✅ Use a narrow custom type to avoid `any`
  type RawJob = {
    id: string;
    title: string | null;
    status: string | null;
    company: string | null;
    location: string | null;
    created_at: string | null;
    users?: { email: string | null } | null;
  };

  return (
    (data as RawJob[])?.map((job) => ({
      id: job.id,
      title: job.title ?? "Untitled Job",
      status: job.status ?? "unknown",
      company: job.company ?? "—",
      location: job.location ?? "—",
      created_at: job.created_at ?? new Date().toISOString(),
      employer_email: job.users?.email ?? "—",
    })) ?? []
  );
}

// 🧾 Fetch all feedback logs (joined via submissions → jobs + users)
export async function getAllFeedbackLogs(): Promise<AdminFeedback[]> {
  const { data, error } = await supabase
    .from("feedback")
    .select(
      `
      id,
      rating,
      comments,
      stars,
      created_at,
      submissions!feedback_submission_id_fkey (
        jobs ( title ),
        users ( email )
      ),
      employer:users!feedback_employer_id_fkey ( email )
    `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  type RawFeedback = {
    id: string;
    rating: number | null;
    stars: number | null;
    comments: string | null;
    created_at: string | null;
    submissions?: {
      jobs?: { title: string | null } | null;
      users?: { email: string | null } | null;
    } | null;
    employer?: { email: string | null } | null;
  };

  return (
    (data as unknown as RawFeedback[])?.map((f) => ({
      id: f.id,
      job_title: f.submissions?.jobs?.title ?? "—",
      candidate_email: f.submissions?.users?.email ?? "—",
      employer_email: f.employer?.email ?? "—",
      rating: f.rating ?? f.stars ?? null,
      comment: f.comments ?? "",
      created_at: f.created_at ?? new Date().toISOString(),
    })) ?? []
  );
}

// 🔁 Update user role
export async function updateUserRole(userId: string, newRole: string) {
  const { error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", userId);
  if (error) throw error;
  return true;
}

export async function getAdminStats(): Promise<AdminStats> {
  // Fetch all feedback rows (for avg calc)
  const { data, error } = await supabase
    .from("feedback")
    .select("rating, stars");

  if (error) throw error;

  // Parallel count queries
  const [
    { count: total_users },
    { count: total_jobs },
    { count: total_submissions },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("submissions").select("*", { count: "exact", head: true }),
  ]);

  // Convert possible nulls to 0
  const safe = (n: number | null) => n ?? 0;

  // Calculate average
  const ratings = Array.isArray(data)
    ? data
        .map((f) => (f.rating ?? f.stars ?? 0) as number)
        .filter((n) => typeof n === "number" && !isNaN(n))
    : [];

  const avg_feedback_score =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + Number(b), 0) / ratings.length).toFixed(2)
      : "—";

  return {
    total_users: safe(total_users),
    total_jobs: safe(total_jobs),
    total_submissions: safe(total_submissions),
    total_feedbacks: data?.length ?? 0,
    avg_feedback_score,
  };
}

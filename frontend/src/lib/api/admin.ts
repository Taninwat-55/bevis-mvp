import { supabase } from "../supabaseClient";
import type { AdminStats } from "../../types/admin";

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

import { supabase } from "../supabaseClient";
import type { AdminStats, BevisUser } from "../../types/admin";

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

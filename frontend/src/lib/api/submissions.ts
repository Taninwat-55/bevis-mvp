import { supabase } from "../supabaseClient";

/**
 * ✅ Get all submissions by a candidate (for candidate dashboard/profile)
 */
export async function getCandidateSubmissions(user_id: string) {
  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      id,
      job_id,
      proof_task_id,
      created_at,
      status,
      submission_link,
      reflection,
      jobs ( title, company ),
      proof_tasks ( title )
    `
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * ✅ Get all submissions for an employer’s jobs (for review dashboard)
 */
export async function getEmployerSubmissions(employer_id: string) {
  // 1️⃣ Get job IDs owned by employer
  const { data: jobIds, error: jobErr } = await supabase
    .from("jobs")
    .select("id")
    .eq("created_by", employer_id);

  if (jobErr) throw jobErr;
  if (!jobIds?.length) return [];

  const ids = jobIds.map((j) => j.id);

  // 2️⃣ Fetch submissions for those jobs
  const { data, error } = await supabase
    .from("submissions")
    .select(
      `
      id,
      user_id,
      created_at,
      status,
      submission_link,
      reflection,
      proof_tasks ( id, title )
    `
    )
    .in("job_id", ids)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * ✅ Get details for a single proof task (for job detail / proof workspace)
 */
export async function getProofTaskDetails(proof_task_id: string) {
  const { data, error } = await supabase
    .from("proof_tasks")
    .select(
      "id, job_id, title, description, expected_time, submission_format, ai_tools_allowed"
    )
    .eq("id", proof_task_id)
    .single();

  if (error) throw error;
  return data;
}

export async function submitProof({
  job_id,
  submission_link,
  reflection,
}: {
  job_id: string;
  submission_link: string;
  reflection?: string;
}) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("submissions")
    .insert([
      {
        user_id: user.id,
        job_id,
        submission_link, // ✅ matches DB
        reflection,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

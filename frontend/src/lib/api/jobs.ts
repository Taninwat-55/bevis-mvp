// src/lib/api/jobs.ts
import { supabase } from "../supabaseClient";

/**
 * ✅ Fetch all public jobs (for candidates)
 */
export async function getAllJobs() {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, description, company, location, paid, created_at, proof_tasks(id, title, expected_time)"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * ✅ Fetch single job + its proof tasks
 */
export async function getJobWithTasks(job_id: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, title, description, company, location, paid, created_by, proof_tasks(id, title, description, expected_time, submission_format, ai_tools_allowed)"
    )
    .eq("id", job_id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * ✅ Fetch all jobs created by the logged-in employer
 */
export async function getEmployerJobs(employer_id: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, title, description, company, location, paid, created_at")
    .eq("created_by", employer_id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}



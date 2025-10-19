// src/types/employer.ts
/**
 * Type representing a single job posted by an employer.
 */
export type EmployerJob = {
  id: string;
  title: string;
  description: string | null;
  company: string | null;
  location: string | null;
  paid: boolean | null;
  created_at: string | null;
};

/**
 * Type representing the summarized stats for each employer job.
 * Mirrors the SQL view `employer_job_summary`.
 */
export type EmployerJobSummary = {
  job_id: string | null;
  employer_id: string | null;
  title: string | null;
  submissions_count: number | null;
  avg_score: number | null;
};

/**
 * Type representing a candidate submission visible to an employer.
 */
export type EmployerSubmission = {
  id: string;
  user_id: string | null;
  job_id: string | null;
  created_at: string | null;
  status: string | null;
  submission_link: string | null;
  reflection: string | null;
  proof_tasks: { id: string; title: string | null } | null;
};

// src/types/shared.ts

/**
 * Shared type used by both candidate and employer flows.
 * Mirrors `proof_tasks` table shape used in both.
 */
export type ProofTask = {
  id: string;
  job_id?: string | null;
  title: string;
  description?: string | null;
  expected_time?: string | null;
  submission_format?: string | null;
  ai_tools_allowed?: boolean | null;
};

// Shape of a feedback record from the `feedback` table.
export type Feedback = {
  id?: string;
  submission_id?: string | null;
  employer_id?: string | null;
  strengths: string | null;
  improvements: string | null;
  stars: number | null;
  created_at: string | null;
};

// src/types/admin.ts
export interface AdminStats {
  total_users: number;
  total_jobs: number;
  total_submissions: number;
  total_feedbacks: number;
  avg_feedback_score: string | number;
}

export interface BevisUser {
  id: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  created_at: string;
}

export interface AdminJob {
  id: string;
  title: string;
  status: string;
  company?: string;
  location?: string;
  created_at: string;
  employer_email: string;
}

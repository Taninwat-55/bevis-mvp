export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      feedback: {
        Row: {
          ai_summary: string | null
          comments: string | null
          created_at: string | null
          employer_id: string | null
          id: string
          improvements: string | null
          rating: number | null
          reviewer_id: string | null
          stars: number | null
          strengths: string | null
          submission_id: string | null
        }
        Insert: {
          ai_summary?: string | null
          comments?: string | null
          created_at?: string | null
          employer_id?: string | null
          id?: string
          improvements?: string | null
          rating?: number | null
          reviewer_id?: string | null
          stars?: number | null
          strengths?: string | null
          submission_id?: string | null
        }
        Update: {
          ai_summary?: string | null
          comments?: string | null
          created_at?: string | null
          employer_id?: string | null
          id?: string
          improvements?: string | null
          rating?: number | null
          reviewer_id?: string | null
          stars?: number | null
          strengths?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submission_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          employer_id: string | null
          featured: boolean | null
          id: string
          is_public: boolean | null
          location: string | null
          paid: boolean | null
          required_skills: string[] | null
          status: string | null
          title: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          employer_id?: string | null
          featured?: boolean | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          paid?: boolean | null
          required_skills?: string[] | null
          status?: string | null
          title: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          employer_id?: string | null
          featured?: boolean | null
          id?: string
          is_public?: boolean | null
          location?: string | null
          paid?: boolean | null
          required_skills?: string[] | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_jobs_employer"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_employer_id_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          credits: number | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          credits?: number | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          credits?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      proof_cards: {
        Row: {
          candidate_name: string | null
          comments: string | null
          id: string
          job_title: string | null
          rating: number | null
          reviewed_at: string | null
          share_url: string | null
          submission_id: string | null
          task_title: string | null
        }
        Insert: {
          candidate_name?: string | null
          comments?: string | null
          id?: string
          job_title?: string | null
          rating?: number | null
          reviewed_at?: string | null
          share_url?: string | null
          submission_id?: string | null
          task_title?: string | null
        }
        Update: {
          candidate_name?: string | null
          comments?: string | null
          id?: string
          job_title?: string | null
          rating?: number | null
          reviewed_at?: string | null
          share_url?: string | null
          submission_id?: string | null
          task_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proof_cards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submission_with_user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proof_cards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_pools: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          top_percent: number | null
          total_pool: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          top_percent?: number | null
          total_pool?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          top_percent?: number | null
          total_pool?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proof_pools_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "employer_job_summary"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "proof_pools_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      proof_tasks: {
        Row: {
          ai_generated: boolean | null
          ai_tools_allowed: boolean | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          expected_time: string | null
          id: string
          instructions: string | null
          job_id: string | null
          submission_format: string | null
          title: string
        }
        Insert: {
          ai_generated?: boolean | null
          ai_tools_allowed?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          expected_time?: string | null
          id?: string
          instructions?: string | null
          job_id?: string | null
          submission_format?: string | null
          title: string
        }
        Update: {
          ai_generated?: boolean | null
          ai_tools_allowed?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          expected_time?: string | null
          id?: string
          instructions?: string | null
          job_id?: string | null
          submission_format?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "proof_tasks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "employer_job_summary"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "proof_tasks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string | null
          employer_notes: string | null
          hiring_stage: string | null
          id: string
          job_id: string | null
          proof_link: string | null
          proof_task_id: string | null
          reflection: string | null
          score: number | null
          status: string | null
          submission_link: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          employer_notes?: string | null
          hiring_stage?: string | null
          id?: string
          job_id?: string | null
          proof_link?: string | null
          proof_task_id?: string | null
          reflection?: string | null
          score?: number | null
          status?: string | null
          submission_link?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          employer_notes?: string | null
          hiring_stage?: string | null
          id?: string
          job_id?: string | null
          proof_link?: string | null
          proof_task_id?: string | null
          reflection?: string | null
          score?: number | null
          status?: string | null
          submission_link?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "employer_job_summary"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_proof_task_id_fkey"
            columns: ["proof_task_id"]
            isOneToOne: false
            referencedRelation: "proof_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_users_reset_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string
        }
        Insert: {
          auth_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role: string
        }
        Update: {
          auth_id?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      employer_job_summary: {
        Row: {
          avg_score: number | null
          employer_id: string | null
          job_id: string | null
          submissions_count: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_jobs_employer"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_with_user: {
        Row: {
          candidate_email: string | null
          candidate_name: string | null
          company: string | null
          created_at: string | null
          hiring_stage: string | null
          id: string | null
          job_id: string | null
          job_title: string | null
          status: string | null
          submission_link: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "employer_job_summary"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_user_id_users_reset_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_job_detail: {
        Args: { job_id_input: string }
        Returns: {
          ai_tools_allowed: boolean
          company: string
          created_at: string
          description: string
          duration_minutes: number
          expected_time: string
          id: string
          paid: boolean
          proof_task_instructions: string
          proof_task_title: string
          submission_format: string
          title: string
        }[]
      }
      get_public_jobs: {
        Args: never
        Returns: {
          company: string
          created_at: string
          description: string
          duration_minutes: number
          id: string
          paid: boolean
          proof_task: string
          title: string
        }[]
      }
      is_admin: { Args: { uid: string }; Returns: boolean }
      promote_to_admin: { Args: never; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

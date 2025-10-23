// src/lib/api/pools.ts 
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/lib/Database";

type ProofPool = Database["public"]["Tables"]["proof_pools"]["Row"];

export async function getProofPools(): Promise<ProofPool[]> {
  const { data, error } = await supabase
    .from("proof_pools")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
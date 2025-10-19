import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";

interface ProofTask {
  id: string;
  title: string;
  description?: string;
  expected_time?: string;
  submission_format?: string;
  ai_tools_allowed?: boolean;
}

interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  description?: string;
  proof_tasks?: ProofTask[];
}

export default function CandidateJobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // guard undefined

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, proof_tasks(*)")
        .eq("id", id)
        .single();

      if (error) toast.error(error.message);
      else setJob(data as Job);
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  if (loading)
    return <p className="p-8 text-[var(--color-text-muted)]">Loading job...</p>;
  if (!job)
    return <p className="p-8 text-[var(--color-error)]">Job not found.</p>;

  const proof = job.proof_tasks?.[0];

  const handleStartProof = () => {
    if (!proof) return; // guard
    toast.success("🚀 Proof task started!");
    navigate(`/candidate/proof/${proof.id}`);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-8 py-10">
      <header className="mb-8">
        <h1 className="heading-lg mb-2">{job.title}</h1>
        <p className="text-[var(--color-text-muted)]">
          {job.company} • {job.location}
        </p>
      </header>

      <section className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)] mb-8">
        <h2 className="heading-md mb-2">About the Role</h2>
        <p className="body-base">{job.description}</p>
      </section>

      {proof && (
        <section className="bg-white p-6 rounded-[var(--radius-card)] border border-[var(--color-border)] shadow-[var(--shadow-soft)]">
          <h2 className="heading-md mb-4">Proof Task</h2>
          <p className="font-medium mb-1">{proof.title}</p>
          <p className="text-[var(--color-text-muted)] mb-3">
            {proof.description}
          </p>
          <ul className="text-sm text-[var(--color-text-muted)] space-y-1 mb-4">
            <li>⏱ Expected Time: {proof.expected_time}</li>
            <li>📦 Submission: {proof.submission_format}</li>
            <li>
              🤖 AI Tools Allowed:{" "}
              {proof.ai_tools_allowed ? (
                <span className="text-[var(--color-success)] font-medium">
                  Yes
                </span>
              ) : (
                <span className="text-[var(--color-error)] font-medium">
                  No
                </span>
              )}
            </li>
          </ul>
          <button
            onClick={handleStartProof}
            className="w-full bg-[var(--color-candidate)] text-white py-3 rounded-[var(--radius-button)] font-medium hover:bg-[var(--color-candidate-dark)] transition"
          >
            Start Proof Task
          </button>
        </section>
      )}
    </div>
  );
}

// src/pages/AdminDashboard.tsx
import { supabase } from "../../lib/supabaseClient";

export default function AdminDashboard() {
  return (
    <div className="p-10">
      <h1 className="heading-lg text-[var(--color-text)] mb-4">
        🧩 Admin Dashboard
      </h1>
      <ul className="space-y-2">
        <li>
          👩‍🎓 <a href="/candidate">View Candidate Dashboard</a>
        </li>
        <li>
          🏢 <a href="/employer">View Employer Dashboard</a>
        </li>
        <li>
          📊 <a href="/data-viewer">Inspect Tables</a>
        </li>
      </ul>
      <button onClick={() => localStorage.setItem("overrideRole", "employer")}>
        Switch to Employer
      </button>
      <button
        onClick={promoteUser}
        className="bg-employer text-white px-4 py-2 rounded-button mt-4"
      >
        Promote to Admin
      </button>
    </div>
  );
}

async function promoteUser() {
  const { error } = await supabase.rpc("promote_to_admin");
  if (error) alert("Error: " + error.message);
  else alert("✅ You are now an admin!");
}

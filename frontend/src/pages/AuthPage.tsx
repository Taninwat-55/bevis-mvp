// src/pages/AuthPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"candidate" | "employer">("candidate");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const role = data?.user?.user_metadata?.role;
      if (role) {
        if (role === "employer") navigate("/employer");
        else if (role === "admin") navigate("/admin");
        else navigate("/");
      }
    });
  }, []);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (error) setMessage(`❌ ${error.message}`);
    else setMessage("✅ Check your email for confirmation link.");
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`❌ ${error.message}`);
      setLoading(false);
      return;
    }

    // ✅ Fetch current user info
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user; // 👈 define it here
    const userRole = user?.user_metadata?.role;

    // ✅ Call the RPC safely
    const { data: isAdmin } = await supabase.rpc("is_admin" as any, {
      uid: user?.id,
    });
    console.log("Admin?", isAdmin);

    // 🧭 Redirect logic
    if (isAdmin) navigate("/admin");
    else if (userRole === "employer") navigate("/employer");
    else navigate("/");

    setMessage("✅ Logged in successfully!");
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="bg-white p-8 rounded-card shadow-soft w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-candidate">
          Welcome to Bevis
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-button px-3 py-2 text-sm focus:ring-2 focus:ring-candidate-light"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-button px-3 py-2 text-sm focus:ring-2 focus:ring-candidate-light"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "candidate" | "employer")
              }
              className="w-full border border-[var(--color-border)] rounded-button px-3 py-2 text-sm"
            >
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <button
            onClick={handleSignUp}
            type="submit"
            disabled={loading}
            className="w-full bg-candidate text-white py-2 rounded-button shadow-soft hover:bg-candidate-dark transition disabled:opacity-50"
          >
            {loading ? "Loading…" : "Sign Up"}
          </button>

          <button
            onClick={handleLogin}
            type="button"
            className="w-full border border-[var(--color-border)] mt-2 py-2 rounded-button text-[var(--color-text)] hover:bg-[var(--color-bg)] transition"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="text-sm mt-4 text-center text-[var(--color-text-muted)]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

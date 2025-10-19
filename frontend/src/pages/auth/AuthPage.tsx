// src/pages/auth/AuthPage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import { notify } from "@/components/ui/Notify";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState<"candidate" | "employer">("candidate");
  const [formLoading, setFormLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  // 🧭 Auto-focus email
  useEffect(() => {
    emailRef.current?.focus();
  }, [isLogin]);

  // 🔐 Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === "employer") navigate("/app/employer");
      else if (user.role === "admin") navigate("/app/admin");
      else navigate("/app");
    }
  }, [user, authLoading, navigate]);

  // 🟣 Sign Up
  async function handleSignUp() {
    if (password !== confirmPassword)
      return notify.error("Passwords do not match.");

    try {
      setFormLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role } },
      });

      if (error) notify.error(`❌ ${error.message}`);
      else notify.success("✅ Check your email for confirmation link.", role);
    } catch (err) {
      console.error("Error", err);
      notify.error("Unexpected error. Please try again.");
    } finally {
      setFormLoading(false);
    }
  }

  // 🟦 Log In
  async function handleLogin() {
    try {
      setFormLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        notify.error(`❌ ${error.message}`);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user;

      if (sessionUser) {
        const role =
          (sessionUser.user_metadata.role as
            | "candidate"
            | "employer"
            | "admin") ?? "candidate";

        localStorage.setItem(
          "bevis_user",
          JSON.stringify({
            id: sessionUser.id,
            email: sessionUser.email,
            role,
          })
        );

        notify.success("✅ Logged in successfully!", role);

        if (role === "admin") navigate("/app/admin");
        else if (role === "employer") navigate("/app/employer");
        else navigate("/app");
      }
    } catch {
      notify.error("Login failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) await handleLogin();
    else await handleSignUp();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] overflow-hidden">
      {/* 🔙 Back to Landing Page */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
      >
        <span>←</span>
        <span>Back</span>
      </button>
      <div className="bg-white p-8 rounded-card shadow-soft w-full max-w-md relative overflow-hidden transition-all duration-300">
        <h1 className="text-2xl font-semibold text-center mb-6 text-[var(--color-candidate-dark)]">
          {isLogin ? "Welcome Back 👋" : "Create Your Account"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Email
            </label>
            <input
              ref={emailRef}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-button px-3 py-2 text-sm focus:ring-2 focus:ring-candidate-light"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-button px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-candidate-light"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-8 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password (signup only) */}
          {!isLogin && (
            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-[var(--color-text)]">
                Confirm Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-400"
                    : "border-[var(--color-border)]"
                } rounded-button px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-candidate-light`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-8 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
          )}

          {/* Role (signup only) */}
          {!isLogin && (
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
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={formLoading}
            className="w-full cursor-pointer bg-[var(--color-candidate-dark)] text-white py-2 rounded-button shadow-soft hover:bg-[var(--color-candidate)] transition disabled:opacity-50"
          >
            {formLoading ? "Loading…" : isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        {/* Forgot Password */}
        {isLogin && (
          <p className="text-sm text-center text-[var(--color-text-muted)] mt-2">
            <button
              type="button"
              onClick={() => navigate("/auth/forgot")}
              className="cursor-pointer text-[var(--color-candidate-dark)] hover:underline"
            >
              Forgot password?
            </button>
          </p>
        )}

        {/* Toggle */}
        <p className="text-sm mt-4 text-center text-[var(--color-text-muted)]">
          {isLogin ? "New to Bevis?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--color-candidate-dark)] cursor-pointer font-medium hover:underline transition-colors"
          >
            {isLogin ? "Create one" : "Log in instead"}
          </button>
        </p>
      </div>
    </div>
  );
}

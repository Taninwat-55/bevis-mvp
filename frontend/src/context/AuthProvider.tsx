import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext, type SessionUser } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Logout handler
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("bevis_user");
    localStorage.removeItem("overrideRole");
  };

  useEffect(() => {
    // 1️⃣ Try cached user first
    const cachedUser = localStorage.getItem("bevis_user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }

    // 2️⃣ Always confirm current Supabase session
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user;
      if (sessionUser) {
        const role =
          (sessionUser.user_metadata.role as SessionUser["role"]) ??
          "candidate";
        const newUser = {
          id: sessionUser.id,
          email: sessionUser.email!,
          role,
        };
        setUser(newUser);
        localStorage.setItem("bevis_user", JSON.stringify(newUser));
      } else {
        setUser(null);
        localStorage.removeItem("bevis_user");
      }
      setLoading(false); // ✅ only now set loading false
    });

    // 3️⃣ Auth change listener
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user;
        if (sessionUser) {
          const role =
            (sessionUser.user_metadata.role as SessionUser["role"]) ??
            "candidate";
          const newUser = {
            id: sessionUser.id,
            email: sessionUser.email!,
            role,
          };
          setUser(newUser);
          localStorage.setItem("bevis_user", JSON.stringify(newUser));
        } else {
          setUser(null);
          localStorage.removeItem("bevis_user");
          localStorage.removeItem("overrideRole");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🪄 Apply local override if any
  const overrideRole = localStorage.getItem("overrideRole");
  const effectiveUser = user
    ? { ...user, role: (overrideRole as SessionUser["role"]) || user.role }
    : null;

  return (
    <AuthContext.Provider value={{ user: effectiveUser, loading, signOut }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen text-gray-500">
          Loading session…
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

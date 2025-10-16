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
    localStorage.removeItem("overrideRole"); // clear override too
  };

  useEffect(() => {
    // 1️⃣ Load cached user (avoid flash)
    const cachedUser = localStorage.getItem("bevis_user");
    if (cachedUser) setUser(JSON.parse(cachedUser));

    // 2️⃣ Check Supabase session
    supabase.auth.getSession().then(({ data }) => {
      const role = data.session?.user?.user_metadata.role;
      if (data.session?.user) {
        const newUser = {
          id: data.session.user.id,
          email: data.session.user.email!,
          role,
        };
        setUser(newUser);
        localStorage.setItem("bevis_user", JSON.stringify(newUser));
      }
      setLoading(false);
    });

    // 3️⃣ Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const role = session?.user?.user_metadata.role;
        if (session?.user) {
          const newUser = {
            id: session.user.id,
            email: session.user.email!,
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

  // 🪄 4️⃣ Apply role override (if any)
  const overrideRole = localStorage.getItem("overrideRole");
  const effectiveUser = user
    ? { ...user, role: (overrideRole as SessionUser["role"]) || user.role }
    : null;

  return (
    <AuthContext.Provider value={{ user: effectiveUser, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// src/context/AuthProvider.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext, type SessionUser } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 1️⃣ Load cached role instantly (prevents flash)
    const cachedUser = localStorage.getItem("bevis_user");
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }

    // ✅ 2️⃣ Check current session
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

    // ✅ 3️⃣ Listen for login/logout changes
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
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

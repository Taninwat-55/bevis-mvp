import { createContext } from "react";

// You can also move the type here to keep everything related
export type SessionUser = {
  id: string;
  email: string;
  role: "candidate" | "employer" | "admin";
};

// This file now has only one job: create and export the context object.
export const AuthContext = createContext<{
  user: SessionUser | null;
  loading: boolean;
  signOut: () => Promise<void>; // ✅ add this line
}>({
  user: null,
  loading: true,
  signOut: async () => {}, // default no-op
});

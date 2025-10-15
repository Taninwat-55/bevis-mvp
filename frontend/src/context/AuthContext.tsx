import { createContext } from "react";

// You can also move the type here to keep everything related
export type SessionUser = {
  id: string;
  email: string;
  role: "candidate" | "employer";
};

// This file now has only one job: create and export the context object.
export const AuthContext = createContext<{
  user: SessionUser | null;
  loading: boolean;
}>({ user: null, loading: true });

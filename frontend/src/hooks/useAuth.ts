// src/hooks/useAuth.ts
import { useContext } from "react";
// Make sure this path is correct!
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => useContext(AuthContext);

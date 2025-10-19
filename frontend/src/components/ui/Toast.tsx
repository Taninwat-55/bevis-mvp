// src/components/ui/Toast.tsx
import { Toaster } from "react-hot-toast";

/**
 * 🎨 Bevis Toast System
 * Unified toast configuration — consistent branding, colors, and sizing.
 */
export const BevisToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 2500,
      style: {
        fontSize: "0.9rem",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        border: "1px solid var(--color-border)",
        background: "white",
        color: "var(--color-text)",
      },
      success: {
        iconTheme: {
          primary: "var(--color-candidate-dark)",
          secondary: "white",
        },
      },
      error: {
        iconTheme: {
          primary: "var(--color-error)",
          secondary: "white",
        },
      },
      loading: {
        iconTheme: {
          primary: "var(--color-employer-dark)",
          secondary: "white",
        },
      },
    }}
  />
);

// src/components/ui/Toast.tsx
import { Toaster, toast } from "react-hot-toast";

/**
 * 🎨 Bevis Toast System
 * Unified toast configuration — consistent branding, colors, and sizing.
 */
export const BevisToaster = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3500,
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

/**
 * 💬 Helper functions for easy branded calls across the app.
 * Example: `notify.success("Job posted!")`
 */
export const notify = {
  success: (msg: string, role?: "candidate" | "employer" | "admin") => {
    const color =
      role === "employer"
        ? "var(--color-employer-dark)"
        : role === "admin"
        ? "#4B5563"
        : "var(--color-candidate-dark)";
    toast.success(msg, {
      style: {
        borderLeft: `4px solid ${color}`,
      },
    });
  },
  error: (msg: string) => toast.error(msg),
  info: (msg: string) =>
    toast(msg, {
      icon: "💡",
      style: {
        borderLeft: `4px solid var(--color-employer-dark)`,
      },
    }),
};

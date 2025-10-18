import { toast } from "react-hot-toast";

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

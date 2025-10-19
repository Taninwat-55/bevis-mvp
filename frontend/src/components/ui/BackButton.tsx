import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  to?: string; // optional custom path
  label?: string; // optional custom text
  className?: string; // optional extra styles
}

export default function BackButton({
  to,
  label = "Back",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer inline-flex items-center gap-1.5 self-start text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded-md px-2 py-1 hover:bg-[var(--color-bg-hover)] transition ${className}`}
    >
      <ArrowLeft size={14} />
      {label}
    </button>
  );
}

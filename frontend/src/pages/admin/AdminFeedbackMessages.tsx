import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Loader2,
  MessageCircle,
  Mail,
  Clock,
  ArrowDownUp,
  Search,
  BarChart2,
} from "lucide-react";
import toast from "react-hot-toast";
import type { FeedbackMessage } from "@/types/admin";

export default function AdminFeedbackMessages() {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("feedback_messages")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        toast.error("Failed to load feedback messages.");
      } else if (data) {
        // 👇 Cast safely if types aren’t updated yet
        setMessages(data as unknown as FeedbackMessage[]);
      }
      setLoading(false);
    };
    loadFeedback();
  }, []);

  /* ─────────────────────────────── Filtering + Sorting ─────────────────────────────── */
  const filteredMessages = useMemo(() => {
    let result = [...messages];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.message.toLowerCase().includes(term) ||
          m.profiles?.email?.toLowerCase().includes(term) ||
          m.page?.toLowerCase().includes(term)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((m) => m.category === categoryFilter);
    }

    result.sort((a, b) => {
      const da = new Date(a.created_at ?? 0).getTime();
      const db = new Date(b.created_at ?? 0).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return result;
  }, [messages, searchTerm, categoryFilter, sortOrder]);

  /* ─────────────────────────────── Summary Counts ─────────────────────────────── */
  const summary = useMemo(() => {
    const counts = { bug: 0, suggestion: 0, question: 0, general: 0 };
    messages.forEach((m) => {
      if (
        m.category &&
        counts[m.category as keyof typeof counts] !== undefined
      ) {
        counts[m.category as keyof typeof counts]++;
      }
    });
    const total = messages.length;
    return { ...counts, total };
  }, [messages]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="heading-lg mb-2 text-[var(--color-text)]">
          💬 Platform Feedback
        </h1>
        <p className="body-base text-[var(--color-text-muted)] max-w-2xl">
          View all feedback submitted by users via the floating feedback button
          — including bug reports, questions, and suggestions.
        </p>
      </header>

      {/* Summary */}
      {!loading && summary.total > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <BarChart2 size={16} />
            <span>
              <b className="text-[var(--color-text)]">{summary.total}</b> total
              feedbacks
            </span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() =>
                setCategoryFilter(categoryFilter === "bug" ? "all" : "bug")
              }
              className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${
                categoryFilter === "bug"
                  ? "ring-2 ring-[var(--color-candidate-dark)]"
                  : ""
              } bg-red-100 text-red-700`}
            >
              🐞 {summary.bug}
            </button>
            <button
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === "suggestion" ? "all" : "suggestion"
                )
              }
              className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${
                categoryFilter === "suggestion"
                  ? "ring-2 ring-[var(--color-candidate-dark)]"
                  : ""
              } bg-yellow-100 text-yellow-800`}
            >
              💡 {summary.suggestion}
            </button>
            <button
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === "question" ? "all" : "question"
                )
              }
              className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${
                categoryFilter === "question"
                  ? "ring-2 ring-[var(--color-candidate-dark)]"
                  : ""
              } bg-blue-100 text-blue-800`}
            >
              ❓ {summary.question}
            </button>
            <button
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === "general" ? "all" : "general"
                )
              }
              className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${
                categoryFilter === "general"
                  ? "ring-2 ring-[var(--color-candidate-dark)]"
                  : ""
              } bg-gray-100 text-gray-700`}
            >
              💬 {summary.general}
            </button>
          </div>
        </div>
      )}

      {/* 🔍 Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            type="text"
            placeholder="Search messages or emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[var(--color-border)] rounded-[var(--radius-button)] pl-8 pr-3 py-2 text-sm focus:ring-1 focus:ring-[var(--color-candidate-dark)]"
          />
        </div>

        {/* Sort toggle */}
        <button
          onClick={() =>
            setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-[var(--color-surface)] hover:bg-[var(--color-bg-hover)] transition"
        >
          <ArrowDownUp size={16} />
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </button>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-muted)]">
          <Loader2 size={24} className="animate-spin mb-2" />
          Loading feedback messages…
        </div>
      )}

      {/* 📋 Table */}
      {!loading && filteredMessages.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] overflow-hidden transition-colors">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
              <tr>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Message</th>
                <th className="py-3 px-4 font-medium">User</th>
                <th className="py-3 px-4 font-medium">Page</th>
                <th className="py-3 px-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        setCategoryFilter(
                          categoryFilter === m.category
                            ? "all"
                            : m.category ?? "all"
                        )
                      }
                      className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer ${
                        m.category === "bug"
                          ? "bg-red-100 text-red-700"
                          : m.category === "suggestion"
                          ? "bg-yellow-100 text-yellow-800"
                          : m.category === "question"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-700"
                      } ${
                        categoryFilter === m.category
                          ? "ring-2 ring-[var(--color-candidate-dark)]"
                          : ""
                      }`}
                    >
                      {m.category}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text)] max-w-md truncate">
                    {m.message}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {m.profiles?.email || "Anonymous"}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)]">
                    {m.page || "—"}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-text-muted)] whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {m.created_at
                        ? new Date(m.created_at).toLocaleString()
                        : "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🚫 Empty */}
      {!loading && filteredMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-[var(--color-text-muted)]">
          <MessageCircle size={28} className="mb-3 opacity-60" />
          <p className="text-base font-medium">No feedback found.</p>
          <p className="text-sm max-w-sm">
            Try adjusting your filters or check again later once users submit
            feedback.
          </p>
        </div>
      )}
    </div>
  );
}

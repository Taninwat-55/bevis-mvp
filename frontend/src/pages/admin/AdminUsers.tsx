// src/pages/admin/AdminUsers.tsx
import { useEffect, useState, useMemo } from "react";
import { getAllUsers, updateUserRole } from "../../lib/api/admin";
import toast from "react-hot-toast";
import type { BevisUser } from "../../types/admin";
import { ArrowDownUp } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AdminUsers() {
  const [users, setUsers] = useState<BevisUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | BevisUser["role"]>(
    "all"
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // 🧾 Pagination state
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to load users: ${message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id: string, newRole: string) => {
    setUpdating(id);
    try {
      await updateUserRole(id, newRole);
      toast.success(`✅ Role updated to ${newRole}`);
      await loadUsers();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Error updating role: ${message}`);
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  // 📊 Compute role counts
  const roleCounts = useMemo(() => {
    return {
      admin: users.filter((u) => u.role === "admin").length,
      employer: users.filter((u) => u.role === "employer").length,
      candidate: users.filter((u) => u.role === "candidate").length,
    };
  }, [users]);

  // 🔍 Derived filtered, searched, sorted, and paginated list
  const filteredUsers = useMemo(() => {
    let result = users;

    if (roleFilter !== "all")
      result = result.filter((u) => u.role === roleFilter);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((u) => u.email.toLowerCase().includes(term));
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [users, searchTerm, roleFilter, sortOrder]);

  // 🧾 Paginated results
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginated = filteredUsers.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    // Reset to page 1 if filters/search change
    setPage(1);
  }, [searchTerm, roleFilter, perPage]);

  if (loading) {
    return (
      <p className="p-8 text-[var(--color-text-muted)]">Loading users...</p>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      {/* 🧭 Header */}
      <header className="mb-8 flex flex-col gap-2">
            <BackButton to="/app/admin" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="heading-lg text-[var(--color-text)]">
              👥 User Management
            </h1>
          </div>

          {/* 🔍 Controls stay aligned on the right */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-candidate-dark)]"
            />

            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value as "all" | BevisUser["role"])
              }
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-[var(--color-surface)] transition-colors"
            >
              <option value="all">All Roles</option>
              <option value="candidate">Candidate</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === "newest" ? "oldest" : "newest"
                )
              }
              className="flex items-center gap-2 border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-bg-hover)] transition"
            >
              <ArrowDownUp size={16} />
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        <p className="body-base text-[var(--color-text-muted)]">
          View all users and manage their roles.
        </p>
      </header>

      {/* 🧮 Role Summary Counters */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-purple-50 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Candidates</p>
          <h3 className="text-xl font-semibold text-[var(--color-candidate-dark)]">
            {roleCounts.candidate}
          </h3>
        </div>
        <div className="p-4 bg-blue-50 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Employers</p>
          <h3 className="text-xl font-semibold text-[var(--color-employer-dark)]">
            {roleCounts.employer}
          </h3>
        </div>
        <div className="p-4 bg-gray-100 border border-[var(--color-border)] rounded-lg text-center">
          <p className="text-sm text-[var(--color-text-muted)]">Admins</p>
          <h3 className="text-xl font-semibold text-gray-700">
            {roleCounts.admin}
          </h3>
        </div>
      </section>

      {/* 📋 Table */}
      <div className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
            <tr>
              <th className="py-3 px-4 text-sm font-medium">Email</th>
              <th className="py-3 px-4 text-sm font-medium">Role</th>
              <th className="py-3 px-4 text-sm font-medium">Created</th>
              <th className="py-3 px-4 text-sm font-medium text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors"
                >
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        u.role === "admin"
                          ? "bg-gray-200 text-gray-700"
                          : u.role === "employer"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={u.role}
                      disabled={updating === u.id}
                      onChange={(e) => handleChangeRole(u.id, e.target.value)}
                      className="border border-[var(--color-border)] rounded px-2 py-1 text-sm"
                    >
                      <option value="candidate">Candidate</option>
                      <option value="employer">Employer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-[var(--color-text-muted)]"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-sm">
        <div className="text-[var(--color-text-muted)]">
          Showing {(page - 1) * perPage + 1}–
          {Math.min(page * perPage, filteredUsers.length)} of{" "}
          {filteredUsers.length} users
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
          >
            Next
          </button>

          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border border-[var(--color-border)] rounded px-2 py-1 bg-[var(--color-surface)] transition-colors"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}

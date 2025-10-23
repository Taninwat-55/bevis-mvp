import { useEffect, useState } from "react";
import { getTableData, getTableSchema } from "@/lib/api/admin";
import toast from "react-hot-toast";
import { ArrowDownUp, Database } from "lucide-react";
import BackButton from "@/components/ui/BackButton";

export default function AdminDataViewer() {
  const [table, setTable] = useState("users");
  const [data, setData] = useState<{
    columns: string[];
    rows: Record<string, unknown>[];
  }>({
    columns: [],
    rows: [],
  });
  const [schema, setSchema] = useState<
    { column_name: string; data_type: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    loadData();
    loadSchema();
  }, [table, page, perPage]);

  const loadData = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * perPage;
      const result = await getTableData(table, perPage, offset);
      setData(result);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to load data: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadSchema = async () => {
    try {
      const cols = await getTableSchema(table);
      setSchema(cols);
    } catch (err) {
      console.error("Schema fetch failed:", err);
    }
  };

  // 🔍 Filter in-memory (simple string match)
  const filteredRows = data.rows.filter((row) =>
    searchTerm
      ? Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      : true
  );

  // 🔃 Sort by created_at if present
  const sortedRows = [...filteredRows].sort((a, b) => {
    const da = new Date(
      String((a as Record<string, unknown>)["created_at"] || 0)
    ).getTime();
    const db = new Date(
      String((b as Record<string, unknown>)["created_at"] || 0)
    ).getTime();
    return sortOrder === "desc" ? db - da : da - db;
  });

  const paginatedRows = sortedRows.slice(0, perPage);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-10">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-2">
        <BackButton to="/admin" />
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="heading-lg text-[var(--color-text)] flex items-center gap-2">
            <Database size={22} /> Data Viewer
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-[var(--color-surface)] transition-colors"
            >
              <option value="users">users</option>
              <option value="jobs">jobs</option>
              <option value="submissions">submissions</option>
              <option value="feedback">feedback</option>
            </select>

            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-admin-dark)]"
            />

            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className="flex items-center gap-2 border border-[var(--color-border)] rounded-[var(--radius-button)] px-3 py-2 text-sm bg-[var(--color-surface)] transition-colors hover:bg-[var(--color-bg-hover)] transition"
            >
              <ArrowDownUp size={16} />
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        <p className="body-base text-[var(--color-text-muted)]">
          Browse raw database tables in read-only mode.
        </p>
      </header>

      {/* Table */}
      <div className="bg-[var(--color-surface)] transition-colors rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] border border-[var(--color-border)] overflow-auto">
        {loading ? (
          <p className="p-8 text-[var(--color-text-muted)]">Loading data…</p>
        ) : data.rows.length > 0 ? (
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-muted)] border-b border-[var(--color-border)]">
              <tr>
                {data.columns.map((col) => (
                  <th key={col} className="py-2 px-4 font-medium">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition"
                >
                  {data.columns.map((col) => (
                    <td
                      key={col}
                      className="py-2 px-4 text-[var(--color-text-muted)]"
                    >
                      {String(row[col] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-[var(--color-text-muted)]">No data found.</p>
        )}
      </div>

      {/* 📄 Pagination Controls */}
      {!loading && data.rows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-sm">
          <div className="text-[var(--color-text-muted)]">
            Showing {(page - 1) * perPage + 1}–
            {Math.min(page * perPage, filteredRows.length)} of{" "}
            {filteredRows.length} rows
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-[var(--color-border)] rounded disabled:opacity-40"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border border-[var(--color-border)] rounded"
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
      )}

      {/* 🧩 Schema info */}
      {schema.length > 0 && (
        <div className="mt-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-muted)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-3 overflow-x-auto">
          <p className="font-medium text-[var(--color-text)] mb-1">
            Columns & Types
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {schema.map((col) => (
              <span key={col.column_name}>
                <strong className="text-[var(--color-text)]">
                  {col.column_name}
                </strong>
                : <span className="italic">{col.data_type}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { reportsAPI, projectsAPI } from "../../utils/apiService"; // adjust path if needed

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";

const fmt = (n) =>
  `Rs ${Number(n || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function ChevronDown() {
  return (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function SortIcon({ active, dir }) {
  return (
    <span className="inline-flex flex-col gap-[1px] ml-1.5 relative top-[1px]">
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path
          d="M3.5 0L7 5H0L3.5 0Z"
          fill={active && dir === "asc" ? "#334155" : "#94a3b8"}
        />
      </svg>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
        <path
          d="M3.5 5L0 0H7L3.5 5Z"
          fill={active && dir === "desc" ? "#334155" : "#94a3b8"}
        />
      </svg>
    </span>
  );
}

// API returns: { client, phone, flat, dueAmount }
const COLS = [
  {
    key: "client",
    label: "CLIENT",
    render: (v) => <span className="font-medium">{v || "—"}</span>,
  },
  {
    key: "phone",
    label: "PHONE",
    render: (v) => <span>{v || "—"}</span>,
  },
  {
    key: "flat",
    label: "UNIT",
    render: (v) => <span>{v || "—"}</span>,
  },
  {
    key: "dueAmount",
    label: "OUTSTANDING",
    render: (v) => {
      const n = Number(v || 0);
      return (
        <span
          className={`font-medium ${
            n < 0
              ? "text-red-500"
              : n === 0
              ? "text-emerald-600"
              : "text-amber-500"
          }`}
        >
          {n < 0 ? `-${fmt(-n)}` : fmt(n)}
        </span>
      );
    },
  },
];

export default function ClientDues() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const PER = 8;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await reportsAPI.clientDues();
      // API returns { data: [ { client, phone, flat, dueAmount } ] }
      const rows = res?.data?.data ?? [];
      setResults(rows);
      setPage(1);
      setSortKey(null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load data. Please try again."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleSort(k) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  const sorted = results
    ? sortKey
      ? [...results].sort((a, b) => {
          const av = a[sortKey] ?? "";
          const bv = b[sortKey] ?? "";
          return sortDir === "asc"
            ? av > bv
              ? 1
              : av < bv
              ? -1
              : 0
            : av < bv
            ? 1
            : av > bv
            ? -1
            : 0;
        })
      : results
    : [];

  const pages = Math.max(1, Math.ceil(sorted.length / PER));
  const safePage = Math.min(page, pages);
  const slice = sorted.slice((safePage - 1) * PER, safePage * PER);

  const totalDue = (results ?? []).reduce(
    (s, r) => s + Number(r.dueAmount || 0),
    0
  );
  const withDues = (results ?? []).filter((r) => Number(r.dueAmount) > 0).length;
  const cleared = (results ?? []).filter((r) => Number(r.dueAmount) <= 0).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">Client Dues</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View outstanding balances for all active bookings
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-10 py-[11px] rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold shadow-sm transition-all self-end disabled:opacity-60"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {results === null && !loading ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center text-slate-400 text-sm">
          Click Generate to load client dues
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center text-slate-400 text-sm">
          Loading...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Outstanding</p>
              <p className="text-xl font-bold text-amber-500 mt-1">
                {fmt(totalDue)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Clients with Dues</p>
              <p className="text-xl font-bold text-slate-800 mt-1">
                {withDues}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Fully Cleared</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {cleared}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    {COLS.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => toggleSort(c.key)}
                        className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-slate-700 select-none"
                      >
                        {c.label}
                        <SortIcon active={sortKey === c.key} dir={sortDir} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slice.length === 0 ? (
                    <tr>
                      <td
                        colSpan={COLS.length}
                        className="py-16 text-center text-sm text-slate-400"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    slice.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        {COLS.map((c) => (
                          <td
                            key={c.key}
                            className="px-5 py-[17px] text-sm text-slate-700 whitespace-nowrap"
                          >
                            {c.render ? c.render(row[c.key], row) : row[c.key]}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 flex-wrap gap-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                {sorted.length === 0 ? 0 : (safePage - 1) * PER + 1}–
                {Math.min(safePage * PER, sorted.length)} of {sorted.length}{" "}
                results
              </p>
              {pages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        safePage === p
                          ? "bg-[#1a6fa8] text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={safePage === pages}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
import { useState } from "react";
import { reportsAPI } from "../../utils/apiService"; 

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";

const DATE_IN =
  "px-4 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-full";

const PROJECTS = ["Ottoman Heights", "Cevher", "Green Valley"];

const fmt = (n) =>
  `Rs ${Number(n || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-6 py-5 flex flex-col gap-1 min-w-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-xl font-bold ${color ?? "text-slate-800"}`}>
        {value}
      </p>
    </div>
  );
}

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

export default function SalesSummary() {
  const [project, setProject] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PER = 8;

  // 🔥 CALL BACKEND API HERE
  async function handleGenerate() {
    try {
      setLoading(true);

      const res = await reportsAPI.salesSummary({
        projectId: project || undefined,
        startDate: fromDate || undefined,
        endDate: toDate || undefined,
      });

      const data = res?.data?.data || [];

      setResults(data);
      setPage(1);
      setSearch("");
      setSortKey(null);
    } catch (err) {
      console.error("API Error:", err);
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

  const filtered = results
    ? results.filter(
        (r) =>
          !search ||
          Object.values(r).some((v) =>
            String(v).toLowerCase().includes(search.toLowerCase())
          )
      )
    : [];

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av =
          typeof a[sortKey] === "number"
            ? a[sortKey]
            : String(a[sortKey]).toLowerCase();
        const bv =
          typeof b[sortKey] === "number"
            ? b[sortKey]
            : String(b[sortKey]).toLowerCase();

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
    : filtered;

  const pages = Math.max(1, Math.ceil(sorted.length / PER));
  const safePage = Math.min(page, pages);
  const slice = sorted.slice((safePage - 1) * PER, safePage * PER);

  const totalPrice = (results ?? []).reduce((s, r) => s + (r.price || 0), 0);
  const totalPaid = (results ?? []).reduce((s, r) => s + (r.received || 0), 0);
  const totalOutstanding = (results ?? []).reduce(
    (s, r) => s + (r.balance || 0),
    0
  );

  const COLS = [
    { key: "customer", label: "CLIENT" },
    { key: "unit", label: "UNIT" },
    {
      key: "price",
      label: "TOTAL PRICE",
      render: (v) => <span>{fmt(v)}</span>,
    },
    {
      key: "received",
      label: "PAID",
      render: (v) => <span className="text-emerald-600">{fmt(v)}</span>,
    },
    {
      key: "balance",
      label: "OUTSTANDING",
      render: (v) => (
        <span className={v > 0 ? "text-red-500" : "text-emerald-600"}>
          {fmt(v)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">
          Sales Summary
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Project-wise sales overview from backend
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[200px]">
          <label className="text-sm font-semibold text-slate-700">
            Project
          </label>
          <div className="relative">
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className={SEL}
            >
              <option value="">All projects</option>
              {PROJECTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className={DATE_IN}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className={DATE_IN}
        />

        <button
          onClick={handleGenerate}
          className="px-10 py-[11px] rounded-lg bg-[#1a6fa8] text-white"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {/* EMPTY STATE */}
      {results === null ? (
        <div className="bg-white p-10 text-center text-slate-400">
          Click Generate to load data
        </div>
      ) : (
        <>
          {/* SUMMARY */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard label="Total Price" value={fmt(totalPrice)} />
            <SummaryCard
              label="Total Paid"
              value={fmt(totalPaid)}
              color="text-emerald-600"
            />
            <SummaryCard
              label="Outstanding"
              value={fmt(totalOutstanding)}
              color="text-red-500"
            />
            <SummaryCard
              label="Bookings"
              value={results.length}
            />
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {COLS.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => toggleSort(c.key)}
                        className="p-4 text-left cursor-pointer"
                      >
                        {c.label}
                        <SortIcon
                          active={sortKey === c.key}
                          dir={sortDir}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {slice.map((row, i) => (
                    <tr key={i} className="border-t">
                      {COLS.map((c) => (
                        <td key={c.key} className="p-4">
                          {c.render
                            ? c.render(row[c.key], row)
                            : row[c.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
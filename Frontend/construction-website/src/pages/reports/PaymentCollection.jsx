import { useState } from "react";
import { reportsAPI } from "../../utils/apiService";

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";
const DATE_IN =
  "px-4 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-full";

const PROJECTS = ["Ottoman Heights", "Cevher", "Green Valley"];

const fmt = (n) =>
  `Rs ${n.toLocaleString("en-PK", {
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
      <svg width="7" height="5">
        <path
          d="M3.5 0L7 5H0L3.5 0Z"
          fill={active && dir === "asc" ? "#334155" : "#94a3b8"}
        />
      </svg>
      <svg width="7" height="5">
        <path
          d="M3.5 5L0 0H7L3.5 5Z"
          fill={active && dir === "desc" ? "#334155" : "#94a3b8"}
        />
      </svg>
    </span>
  );
}

const COLS = [
  { key: "receipt", label: "RECEIPT #" },
  {
    key: "display",
    label: "CLIENT",
    render: (_, r) => (
      <span>
        {r.client} ({r.cnic})
      </span>
    ),
  },
  { key: "project", label: "PROJECT" },
  { key: "unit", label: "UNIT" },
  { key: "date", label: "DATE" },
  { key: "mode", label: "MODE" },
  {
    key: "amount",
    label: "AMOUNT",
    render: (v) => (
      <span className="text-emerald-600 font-medium">{fmt(v)}</span>
    ),
  },
];

export default function PaymentCollection() {
  const [project, setProject] = useState("");
  const [mode, setMode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [results, setResults] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const PER = 8;

  // ✅ API INTEGRATION (ONLY CHANGE)
  async function handleGenerate() {
    try {
      const params = {};
      if (project) params.project = project;
      if (mode) params.mode = mode;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await reportsAPI.paymentCollection(params);

      let d = res.data.data || [];

      // 🔒 SAME LOGIC (UNCHANGED)
      if (project) d = d.filter((r) => r.project === project);
      if (mode) d = d.filter((r) => r.mode === mode);

      if (fromDate || toDate) {
        d = d.filter((r) => {
          const [dd, mm, yyyy] = r.date.split("/");
          const rd = `${yyyy}-${mm}-${dd}`;
          if (fromDate && rd < fromDate) return false;
          if (toDate && rd > toDate) return false;
          return true;
        });
      }

      setResults(d);
      setPage(1);
      setSearch("");
      setSortKey(null);
    } catch (err) {
      console.error("API Error:", err);
      setResults([]);
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
          [r.receipt, r.client, r.cnic, r.project, r.unit, r.date, r.mode].some(
            (v) =>
              String(v).toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : [];

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
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
    : filtered;

  const pages = Math.max(1, Math.ceil(sorted.length / PER));
  const safePage = Math.min(page, pages);
  const slice = sorted.slice((safePage - 1) * PER, safePage * PER);

  const totalCollection = (results ?? []).reduce((s, r) => s + r.amount, 0);
  const cashTotal = (results ?? [])
    .filter((r) => r.mode === "Cash")
    .reduce((s, r) => s + r.amount, 0);
  const chequeTotal = (results ?? [])
    .filter((r) => r.mode === "Cheque")
    .reduce((s, r) => s + r.amount, 0);
  const bankTotal = (results ?? [])
    .filter((r) => r.mode === "Bank Transfer")
    .reduce((s, r) => s + r.amount, 0);

  const cashCount = (results ?? []).filter((r) => r.mode === "Cash").length;
  const chequeCount = (results ?? []).filter((r) => r.mode === "Cheque").length;
  const bankCount = (results ?? []).filter(
    (r) => r.mode === "Bank Transfer",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[22px] font-bold text-slate-800">
        Payment Collection Report
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <select value={project} onChange={(e) => setProject(e.target.value)} className={SEL}>
          <option value="">All projects</option>
          {PROJECTS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select value={mode} onChange={(e) => setMode(e.target.value)} className={SEL}>
          <option value="">All modes</option>
          <option>Cash</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
        </select>

        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={DATE_IN} />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={DATE_IN} />

        <button onClick={handleGenerate} className="px-6 py-2 bg-blue-600 text-white rounded">
          Generate
        </button>
      </div>

      {/* Table */}
      {results && (
        <table className="w-full mt-4">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th key={c.key} onClick={() => toggleSort(c.key)}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr key={i}>
                {COLS.map((c) => (
                  <td key={c.key}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
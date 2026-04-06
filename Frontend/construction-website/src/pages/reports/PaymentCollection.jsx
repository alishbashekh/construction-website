import { useState } from "react";

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";
const DATE_IN =
  "px-4 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-full";
const PROJECTS = ["Ottoman Heights", "Cevher", "Green Valley"];
const fmt = (n) =>
  `Rs ${n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ALL_PAYMENTS = [
  {
    receipt: "PAY-00020",
    client: "Sameer Shaikh",
    cnic: "41302-2469092-7",
    project: "Ottoman Heights",
    unit: "108",
    date: "31/03/2026",
    mode: "Cash",
    amount: 50000,
  },
  {
    receipt: "PAY-00019",
    client: "Samantha Hurst",
    cnic: "23132-1312312-2",
    project: "Ottoman Heights",
    unit: "401",
    date: "31/03/2026",
    mode: "Cash",
    amount: 50000,
  },
  {
    receipt: "PAY-00018",
    client: "Danish",
    cnic: "41305-8987452-3",
    project: "Ottoman Heights",
    unit: "301",
    date: "20/03/2026",
    mode: "Cash",
    amount: 5000000,
  },
  {
    receipt: "PAY-00017",
    client: "Nadeem Baig",
    cnic: "42101-7654321-5",
    project: "Cevher",
    unit: "401",
    date: "19/03/2026",
    mode: "Cash",
    amount: 300000,
  },
  {
    receipt: "PAY-00016",
    client: "Danish",
    cnic: "41305-8987452-3",
    project: "Ottoman Heights",
    unit: "301",
    date: "10/03/2026",
    mode: "Cash",
    amount: 5000000,
  },
  {
    receipt: "PAY-00015",
    client: "Danish",
    cnic: "41305-8987452-3",
    project: "Ottoman Heights",
    unit: "301",
    date: "01/03/2026",
    mode: "Cash",
    amount: 5000000,
  },
  {
    receipt: "PAY-00014",
    client: "Danish",
    cnic: "41305-8987452-3",
    project: "Ottoman Heights",
    unit: "301",
    date: "20/02/2026",
    mode: "Cash",
    amount: 5000000,
  },
  {
    receipt: "PAY-00013",
    client: "Nadeem Baig",
    cnic: "42101-7654321-5",
    project: "Cevher",
    unit: "401",
    date: "15/02/2026",
    mode: "Cash",
    amount: 5000000,
  },
  {
    receipt: "PAY-00012",
    client: "Nadeem Baig",
    cnic: "42101-7654321-5",
    project: "Cevher",
    unit: "401",
    date: "10/02/2026",
    mode: "Cash",
    amount: 5000000,
  },
  {
    receipt: "PAY-00011",
    client: "Danish",
    cnic: "41305-8987452-3",
    project: "Ottoman Heights",
    unit: "301",
    date: "05/02/2026",
    mode: "Cash",
    amount: 2550000,
  },
  {
    receipt: "PAY-00010",
    client: "Bilal Ajmery",
    cnic: "42000-1234567-9",
    project: "Ottoman Heights",
    unit: "205",
    date: "01/02/2026",
    mode: "Cash",
    amount: 3000000,
  },
  {
    receipt: "PAY-00009",
    client: "Bilal Ajmery",
    cnic: "42000-1234567-9",
    project: "Ottoman Heights",
    unit: "205",
    date: "20/01/2026",
    mode: "Cash",
    amount: 3000000,
  },
  {
    receipt: "PAY-00008",
    client: "Ali Raza",
    cnic: "35201-1122334-4",
    project: "Ottoman Heights",
    unit: "201",
    date: "15/01/2026",
    mode: "Cash",
    amount: 950000,
  },
  {
    receipt: "PAY-00007",
    client: "Razia Sultana",
    cnic: "61101-9988776-1",
    project: "Green Valley",
    unit: "302",
    date: "10/01/2026",
    mode: "Cash",
    amount: 1100000,
  },
  {
    receipt: "PAY-00006",
    client: "Sara Ahmed",
    cnic: "42201-3344556-8",
    project: "Cevher",
    unit: "205",
    date: "05/01/2026",
    mode: "Cash",
    amount: 3200000,
  },
  {
    receipt: "PAY-00005",
    client: "Usman Malik",
    cnic: "37405-5566778-2",
    project: "Green Valley",
    unit: "301",
    date: "01/01/2026",
    mode: "Cash",
    amount: 200000,
  },
  {
    receipt: "PAY-00004",
    client: "Bilal Ajmery",
    cnic: "42000-1234567-9",
    project: "Ottoman Heights",
    unit: "102",
    date: "17/12/2025",
    mode: "Cash",
    amount: 450000,
  },
  {
    receipt: "PAY-00003",
    client: "Sara Ahmed",
    cnic: "42201-3344556-8",
    project: "Cevher",
    unit: "205",
    date: "10/12/2025",
    mode: "Bank Transfer",
    amount: 1000000,
  },
  {
    receipt: "PAY-00002",
    client: "Usman Malik",
    cnic: "37405-5566778-2",
    project: "Green Valley",
    unit: "301",
    date: "05/12/2025",
    mode: "Cheque",
    amount: 5000000,
  },
  {
    receipt: "PAY-00001",
    client: "Sameer Shaikh",
    cnic: "41302-2469092-7",
    project: "Green Valley",
    unit: "101",
    date: "01/12/2025",
    mode: "Bank Transfer",
    amount: 5000000,
  },
];

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

  function handleGenerate() {
    let d = [...ALL_PAYMENTS];
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
            (v) => String(v).toLowerCase().includes(search.toLowerCase()),
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
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">
          Payment Collection Report
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Summary of all received payments
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label className="text-sm font-semibold text-slate-700">
            Project{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className={SEL}
            >
              <option value="">All projects</option>
              {PROJECTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-sm font-semibold text-slate-700">
            Payment Mode{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className={SEL}
            >
              <option value="">All modes</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
            <ChevronDown />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            From Date{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={DATE_IN + " min-w-[160px]"}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            To Date{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={DATE_IN + " min-w-[160px]"}
          />
        </div>
        <button
          onClick={handleGenerate}
          className="px-10 py-[11px] rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold shadow-sm transition-all self-end w-full md:w-auto"
        >
          Generate
        </button>
      </div>

      {results === null ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center text-slate-400 text-sm">
          No data found
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Collection</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {fmt(totalCollection)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Payments</p>
              <p className="text-xl font-bold text-slate-800 mt-1">
                {results.length}
              </p>
            </div>
            {chequeTotal > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
                <p className="text-sm text-slate-500">Cheque</p>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {fmt(chequeTotal)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {chequeCount} payment{chequeCount > 1 ? "s" : ""}
                </p>
              </div>
            )}
            {cashTotal > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
                <p className="text-sm text-slate-500">Cash</p>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {fmt(cashTotal)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {cashCount} payment{cashCount > 1 ? "s" : ""}
                </p>
              </div>
            )}
            {bankTotal > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
                <p className="text-sm text-slate-500">Bank</p>
                <p className="text-xl font-bold text-slate-800 mt-1">
                  {fmt(bankTotal)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {bankCount} payment{bankCount > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Table with search */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="relative w-72">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search client..."
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
            </div>
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
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 flex-wrap gap-3">
              <p className="text-xs text-slate-500">
                Showing {sorted.length === 0 ? 0 : (safePage - 1) * PER + 1}–
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
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${safePage === p ? "bg-[#1a6fa8] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={safePage === pages}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
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

import { useState } from "react";

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";
const PROJECTS = ["Ottoman Heights", "Cevher", "Green Valley"];
const fmt = (n) =>
  `Rs ${n.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ALL_DUES = [
  {
    client: "Sameer Shaikh",
    cnic: "41302-2469092-7",
    project: "Ottoman Heights",
    unit: "102",
    price: 620000,
    paid: 200000,
  },
  {
    client: "Sameer Shaikh",
    cnic: "41302-2469092-7",
    project: "Ottoman Heights",
    unit: "108",
    price: 3000000,
    paid: 50000,
  },
  {
    client: "Danish",
    cnic: "41305-8987452-3",
    project: "Ottoman Heights",
    unit: "301",
    price: 22500000,
    paid: 22550000,
  },
  {
    client: "Samantha Hurst",
    cnic: "23132-1312312-2",
    project: "Ottoman Heights",
    unit: "401",
    price: 5000000,
    paid: 50000,
  },
  {
    client: "Ali Raza",
    cnic: "35201-1122334-4",
    project: "Ottoman Heights",
    unit: "201",
    price: 4750000,
    paid: 950000,
  },
  {
    client: "Bilal Ajmery",
    cnic: "42000-1234567-9",
    project: "Ottoman Heights",
    unit: "205",
    price: 12000000,
    paid: 6000000,
  },
  {
    client: "Nadeem Baig",
    cnic: "42101-7654321-5",
    project: "Cevher",
    unit: "401",
    price: 27500000,
    paid: 27500000,
  },
  {
    client: "Sara Ahmed",
    cnic: "42201-3344556-8",
    project: "Cevher",
    unit: "205",
    price: 3200000,
    paid: 3200000,
  },
  {
    client: "Usman Malik",
    cnic: "37405-5566778-2",
    project: "Green Valley",
    unit: "301",
    price: 4200000,
    paid: 200000,
  },
  {
    client: "Razia Sultana",
    cnic: "61101-9988776-1",
    project: "Green Valley",
    unit: "302",
    price: 5500000,
    paid: 1100000,
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
  {
    key: "price",
    label: "BOOKING PRICE",
    render: (v) => <span>{fmt(v)}</span>,
  },
  {
    key: "paid",
    label: "PAID",
    render: (v) => (
      <span className="text-emerald-600 font-medium">{fmt(v)}</span>
    ),
  },
  {
    key: "outstanding",
    label: "OUTSTANDING",
    render: (_, r) => {
      const o = r.price - r.paid;
      return (
        <span
          className={`font-medium ${o < 0 ? "text-red-500" : o === 0 ? "text-emerald-600" : "text-amber-500"}`}
        >
          {o < 0 ? `-${fmt(-o)}` : fmt(o)}
        </span>
      );
    },
  },
];

export default function ClientDues() {
  const [project, setProject] = useState("");
  const [results, setResults] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const PER = 8;

  function handleGenerate() {
    let d = [...ALL_DUES];
    if (project) d = d.filter((r) => r.project === project);
    setResults(d);
    setPage(1);
    setSortKey(null);
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

  const totalPrice = (results ?? []).reduce((s, r) => s + r.price, 0);
  const totalPaid = (results ?? []).reduce((s, r) => s + r.paid, 0);
  const totalOutstanding = totalPrice - totalPaid;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">Client Dues</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View outstanding balances for clients by project
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[200px]">
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
        <button
          onClick={handleGenerate}
          className="px-10 py-[11px] rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold shadow-sm transition-all self-end"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Booking Price</p>
              <p className="text-xl font-bold text-slate-800 mt-1">
                {fmt(totalPrice)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Paid</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {fmt(totalPaid)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Outstanding</p>
              <p className="text-xl font-bold text-amber-500 mt-1">
                {fmt(totalOutstanding)}
              </p>
            </div>
          </div>

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

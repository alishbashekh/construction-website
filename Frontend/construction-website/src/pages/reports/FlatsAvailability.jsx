import { useState } from "react";

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";

const PROJECTS = ["Ottoman Heights", "Cevher", "Green Valley"];

const ALL_FLATS = [
  {
    project: "Ottoman Heights",
    unit: "101",
    floor: "1",
    type: "Residential",
    status: "Sold",
  },
  {
    project: "Ottoman Heights",
    unit: "102",
    floor: "1",
    type: "Residential",
    status: "Booked",
  },
  {
    project: "Ottoman Heights",
    unit: "108",
    floor: "1",
    type: "Residential",
    status: "Booked",
  },
  {
    project: "Ottoman Heights",
    unit: "201",
    floor: "2",
    type: "Residential",
    status: "Sold",
  },
  {
    project: "Ottoman Heights",
    unit: "205",
    floor: "2",
    type: "Residential",
    status: "Booked",
  },
  {
    project: "Ottoman Heights",
    unit: "301",
    floor: "3",
    type: "Residential",
    status: "Booked",
  },
  {
    project: "Ottoman Heights",
    unit: "401",
    floor: "4",
    type: "Residential",
    status: "Booked",
  },
  {
    project: "Ottoman Heights",
    unit: "402",
    floor: "4",
    type: "Residential",
    status: "Available",
  },
  {
    project: "Ottoman Heights",
    unit: "501",
    floor: "5",
    type: "Penthouse",
    status: "Available",
  },
  {
    project: "Cevher",
    unit: "101",
    floor: "1",
    type: "Residential",
    status: "Available",
  },
  {
    project: "Cevher",
    unit: "205",
    floor: "2",
    type: "Residential",
    status: "Sold",
  },
  {
    project: "Cevher",
    unit: "401",
    floor: "4",
    type: "Residential",
    status: "Booked",
  },
  {
    project: "Green Valley",
    unit: "101",
    floor: "1",
    type: "Residential",
    status: "Sold",
  },
  {
    project: "Green Valley",
    unit: "301",
    floor: "3",
    type: "Residential",
    status: "Available",
  },
  {
    project: "Green Valley",
    unit: "302",
    floor: "3",
    type: "Residential",
    status: "Available",
  },
];

const STATUS_BADGE = {
  Available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Sold: "bg-red-50    text-red-600     border border-red-200",
  Booked: "bg-blue-50   text-blue-600    border border-blue-200",
};

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
  { key: "unit", label: "UNIT" },
  { key: "floor", label: "FLOOR" },
  { key: "type", label: "TYPE" },
  {
    key: "status",
    label: "STATUS",
    render: (v) => (
      <span
        className={`px-3 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[v]}`}
      >
        {v}
      </span>
    ),
  },
];

export default function FlatsAvailability() {
  const [project, setProject] = useState("");
  const [status, setStatus] = useState("");
  const [results, setResults] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const PER = 8;

  function handleGenerate() {
    let d = [...ALL_FLATS];
    if (project) d = d.filter((r) => r.project === project);
    if (status) d = d.filter((r) => r.status === status);
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
      ? [...results].sort((a, b) =>
          sortDir === "asc"
            ? String(a[sortKey]).localeCompare(String(b[sortKey]))
            : String(b[sortKey]).localeCompare(String(a[sortKey])),
        )
      : results
    : [];

  const pages = Math.max(1, Math.ceil(sorted.length / PER));
  const safePage = Math.min(page, pages);
  const slice = sorted.slice((safePage - 1) * PER, safePage * PER);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">
          Flat Availability Report
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Current availability status of flats by project
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
        <div className="flex flex-col gap-1.5 min-w-[180px]">
          <label className="text-sm font-semibold text-slate-700">
            Status{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={SEL}
            >
              <option value="">All statuses</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Booked">Booked</option>
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  {COLS.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => toggleSort(c.key)}
                      className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-slate-700 select-none"
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
                      colSpan={4}
                      className="py-16 text-center text-sm text-slate-400"
                    >
                      No flats found.
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
                          className="px-6 py-[17px] text-sm text-slate-700 whitespace-nowrap"
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
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 flex-wrap gap-3">
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
      )}
    </div>
  );
}

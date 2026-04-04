import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Inbox,
  Search,
  UserRoundPlus,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";

/**
 * DataTable — fully reusable table component
 *
 * Props:
 *   title        : string
 *   subtitle     : string
 *   columns      : [{ key, label, sortable?, render?(val,row) }]
 *   data         : array of row objects
 *   filters      : [{ key, placeholder, options:[{value,label}] }]
 *   onAddClick   : fn — called when Add button clicked
 *   addLabel     : string  (default "Add")
 *   addIcon      : ReactNode (optional)
 *   rowsPerPage  : number  (default 10)
 *   searchKeys   : [string] — which fields to search across
 *   emptyMessage : string
 */
export default function DataTable({
  title = "",
  subtitle = "",
  columns = [],
  data = [],
  filters = [],
  onAddClick,
  addLabel = "Add",
  addIcon,
  rowsPerPage = 10,
  searchKeys = [],
  emptyMessage = "No records found.",
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterVals, setFilterVals] = useState(
    Object.fromEntries(filters.map((f) => [f.key, ""])),
  );

  function updateSearch(val) {
    setSearch(val);
    setPage(1);
  }
  function updateFilter(key, val) {
    setFilterVals((p) => ({ ...p, [key]: val }));
    setPage(1);
  }

  const afterSearch = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      (searchKeys.length ? searchKeys : columns.map((c) => c.key)).some((k) =>
        String(row[k] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, search, searchKeys, columns]);

  const afterFilter = useMemo(
    () =>
      afterSearch.filter((row) =>
        filters.every((f) => {
          const val = filterVals[f.key];
          return (
            !val || String(row[f.key] ?? "").toLowerCase() === val.toLowerCase()
          );
        }),
      ),
    [afterSearch, filterVals, filters],
  );

  const afterSort = useMemo(() => {
    if (!sortKey) return afterFilter;
    return [...afterFilter].sort((a, b) => {
      const av = String(a[sortKey] ?? "").toLowerCase();
      const bv = String(b[sortKey] ?? "").toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [afterFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(afterSort.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);
  const pageSlice = afterSort.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function pageNumbers() {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safePage - delta && i <= safePage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }

  function SortIcon({ colKey }) {
    const active = sortKey === colKey;
    return (
      <span className="inline-flex flex-col gap-[1px] ml-1.5 relative top-[1px]">
        <div className="flex flex-col items-center -space-y-1">
          <ChevronUp size={10} />
          <ChevronDown size={10} />
        </div>
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {onAddClick && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold shadow-sm transition-all duration-150 shrink-0"
          >
            {addIcon ?? <UserRoundPlus className="w-8 h-8" />}
            {addLabel}
          </button>
        )}
      </div>

      {/* ── Filters + Search row ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Dropdown filters */}
        {filters.map((f) => (
          <div key={f.key} className="relative">
            <select
              value={filterVals[f.key]}
              onChange={(e) => updateFilter(f.key, e.target.value)}
              className="appearance-none pl-4 pr-9 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 font-medium shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer min-w-[148px]"
            >
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        ))}

        <div className="relative ml-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all"
          />
          {search && (
            <button
              onClick={() => updateSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 ">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && toggleSort(col.key)}
                    className={`px-4 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap select-none ${col.sortable ? "cursor-pointer hover:text-slate-700" : ""} `}
                  >
                    {col.label}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageSlice.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3 text-slate-600">
                      <Inbox
                        className="w-12 h-12 text-slate-200"
                        strokeWidth={1}
                      />
                      <span className="text-sm">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pageSlice.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    className="border-b border-slate-300 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-[14px] text-[12px] text-slate-700 whitespace-nowrap"
                      >
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination footer ── */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-white flex-wrap gap-3">
          <p className="text-xs text-slate-500">
            {afterSort.length === 0
              ? "No records"
              : `Showing ${(safePage - 1) * rowsPerPage + 1}–${Math.min(safePage * rowsPerPage, afterSort.length)} of ${afterSort.length} results`}
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* Page numbers */}
              {pageNumbers().map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-slate-400 text-sm"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      safePage === p
                        ? "bg-[#1a6fa8] text-white shadow-sm"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

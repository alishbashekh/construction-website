import { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import { ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { logsAPI } from "../../utils/apiService";

function SeverityBadge({ value }) {
  const styles = {
    info:    "bg-blue-50 text-blue-800 border border-blue-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    error:   "bg-red-50 text-red-800 border border-red-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  };
  const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[value?.toLowerCase()] ?? styles.info}`}>
      {label}
    </span>
  );
}

function PerformerCell({ row }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-slate-800 font-medium text-xs">{row.performedBy?.fullName || "System"}</span>
      <span className="text-slate-400 text-[11px]">{row.performedBy?.email || ""}</span>
    </div>
  );
}

const COLUMNS = [
  {
    key: "createdAt",
    label: "Time",
    sortable: true,
    render: (v) => v ? new Date(v).toLocaleString("en-PK") : "-",
  },
  { key: "severity",    label: "Severity",    sortable: true, render: (v) => <SeverityBadge value={v} /> },
  { key: "category",    label: "Category",    sortable: true },
  { key: "action",      label: "Action",      sortable: true },
  { key: "performedBy", label: "Performed By",sortable: false, render: (_, row) => <PerformerCell row={row} /> },
  { key: "description", label: "Description", sortable: false },
];

const TABLE_FILTERS = [
  {
    key: "severity",
    options: [
      { value: "",        label: "All severities" },
      { value: "info",    label: "Info" },
      { value: "warning", label: "Warning" },
      { value: "error",   label: "Error" },
      { value: "success", label: "Success" },
    ],
  },
];

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">{label} <span className="text-slate-400">(Optional)</span></label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

const EMPTY_FILTERS = { category: "", action: "", severity: "", performedByEmail: "", startDate: "", endDate: "", search: "" };

export default function LogsPage() {
  const [panel,    setPanel]    = useState(EMPTY_FILTERS);
  const [logs,     setLogs]     = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);

  const f = (k, v) => setPanel((p) => ({ ...p, [k]: v }));

  const loadLogs = useCallback(async (activeFilters = EMPTY_FILTERS, currentPage = 1) => {
    setFetching(true);
    setFetchErr("");
    try {
      // Build query params — only include non-empty values
      const params = { page: currentPage, limit: 50 };
      if (activeFilters.category)         params.category         = activeFilters.category;
      if (activeFilters.action)           params.action           = activeFilters.action;
      if (activeFilters.severity)         params.severity         = activeFilters.severity;
      if (activeFilters.performedByEmail) params.performedByEmail = activeFilters.performedByEmail;
      if (activeFilters.startDate)        params.startDate        = activeFilters.startDate;
      if (activeFilters.endDate)          params.endDate          = activeFilters.endDate;
      if (activeFilters.search)           params.search           = activeFilters.search;

      const res = await logsAPI.getAll(params);
      setLogs(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load logs.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  function applyFilters() { setPage(1); loadLogs(panel, 1); }
  function resetFilters() { setPanel(EMPTY_FILTERS); setPage(1); loadLogs(EMPTY_FILTERS, 1); }

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-800 leading-tight">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Track all important actions and changes in the system. {total > 0 && `(${total} total)`}
        </p>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterSelect
            label="Category"
            value={panel.category}
            onChange={(v) => f("category", v)}
            options={[
              { value: "",              label: "All categories" },
              { value: "auth",          label: "Auth" },
              { value: "user_management", label: "User Management" },
              { value: "booking",       label: "Booking" },
              { value: "payment",       label: "Payment" },
              { value: "client",        label: "Client" },
              { value: "flat",          label: "Flat" },
              { value: "project",       label: "Project" },
            ]}
          />
          <FilterSelect
            label="Severity"
            value={panel.severity}
            onChange={(v) => f("severity", v)}
            options={[
              { value: "",        label: "All severities" },
              { value: "info",    label: "Info" },
              { value: "warning", label: "Warning" },
              { value: "error",   label: "Error" },
              { value: "success", label: "Success" },
            ]}
          />
          <div>
            <label className="block text-xs text-slate-500 mb-1">Performed By (Email) <span className="text-slate-400">(Optional)</span></label>
            <input
              type="email" placeholder="Email"
              value={panel.performedByEmail}
              onChange={(e) => f("performedByEmail", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Search Description <span className="text-slate-400">(Optional)</span></label>
            <input
              type="text" placeholder="Search in description..."
              value={panel.search}
              onChange={(e) => f("search", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">From Date <span className="text-slate-400">(Optional)</span></label>
            <input type="date" value={panel.startDate} onChange={(e) => f("startDate", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">To Date <span className="text-slate-400">(Optional)</span></label>
            <input type="date" value={panel.endDate} onChange={(e) => f("endDate", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div className="lg:col-start-4 flex gap-2">
            <button onClick={resetFilters}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors">
              Reset
            </button>
            <button onClick={applyFilters}
              className="flex-1 px-4 py-2 rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {fetching ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-blue-500" size={28} />
          <span className="ml-3 text-slate-500">Loading logs...</span>
        </div>
      ) : fetchErr ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
          <AlertCircle size={18} /> {fetchErr}
          <button onClick={() => loadLogs()} className="ml-4 underline text-sm">Retry</button>
        </div>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={logs}
          filters={TABLE_FILTERS}
          searchKeys={["category", "action", "description"]}
          rowsPerPage={20}
          emptyMessage="No logs yet."
        />
      )}
    </div>
  );
}

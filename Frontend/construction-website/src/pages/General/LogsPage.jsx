import { useState, useMemo } from "react";
import DataTable from "../../components/common/DataTable";
import { ChevronDown } from "lucide-react";

function SeverityBadge({ value }) {
  const styles = {
    Info:    "bg-blue-50 text-blue-800 border border-blue-200",
    Warning: "bg-amber-50 text-amber-800 border border-amber-200",
    Error:   "bg-red-50 text-red-800 border border-red-200",
    Success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[value] ?? styles.Info}`}>
      {value}
    </span>
  );
}

function PerformerCell({ row }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-slate-800 font-medium text-xs">{row.performer}</span>
      <span className="text-slate-400 text-[11px]">{row.email}</span>
    </div>
  );
}

const COLUMNS = [
  { key: "time",        label: "Time",         sortable: true },
  { key: "severity",    label: "Severity",     sortable: true, render: (v) => <SeverityBadge value={v} /> },
  { key: "category",    label: "Category",     sortable: true },
  { key: "action",      label: "Action",       sortable: true },
  { key: "performer",   label: "Performed By", sortable: true, render: (_, row) => <PerformerCell row={row} /> },
  { key: "description", label: "Description",  sortable: false },
];

const TABLE_FILTERS = [
  {
    key: "severity",
    options: [
      { value: "", label: "All severities" },
      { value: "Info",    label: "Info" },
      { value: "Warning", label: "Warning" },
      { value: "Error",   label: "Error" },
      { value: "Success", label: "Success" },
    ],
  },
];

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1">
        {label} <span className="text-slate-400">(Optional)</span>
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full pl-3 pr-8 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

const EMPTY_FILTERS = { category: "", action: "", severity: "", email: "", from: "", to: "", desc: "" };

export default function LogsPage() {
  const [panel, setPanel] = useState(EMPTY_FILTERS);
  const [active, setActive] = useState(EMPTY_FILTERS);

  const f = (k, v) => setPanel((p) => ({ ...p, [k]: v }));

  function applyFilters() {
    setActive({ ...panel });
  }

  function resetFilters() {
    setPanel(EMPTY_FILTERS);
    setActive(EMPTY_FILTERS);
  }

  // Replace [] with your real data source
  const logsData = [];

  const filteredData = useMemo(() => {
    return logsData.filter((row) => {
      if (active.category && row.category !== active.category) return false;
      if (active.action   && row.action   !== active.action)   return false;
      if (active.severity && row.severity !== active.severity) return false;
      if (active.email    && !row.email.toLowerCase().includes(active.email.toLowerCase())) return false;
      if (active.from     && row.time.slice(0, 10) < active.from) return false;
      if (active.to       && row.time.slice(0, 10) > active.to)   return false;
      if (active.desc     && !row.description.toLowerCase().includes(active.desc.toLowerCase())) return false;
      return true;
    });
  }, [logsData, active]);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-[22px] font-bold text-slate-800 leading-tight">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track all important actions and changes in the system.</p>
      </div>

      {/* ── Advanced Filter Panel ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterSelect
            label="Category"
            value={panel.category}
            onChange={(v) => f("category", v)}
            options={[
              { value: "", label: "Select an option" },
              { value: "User",    label: "User" },
              { value: "Booking", label: "Booking" },
              { value: "Project", label: "Project" },
              { value: "Finance", label: "Finance" },
            ]}
          />
          <FilterSelect
            label="Action"
            value={panel.action}
            onChange={(v) => f("action", v)}
            options={[
              { value: "", label: "Select an option" },
              { value: "Login",   label: "Login" },
              { value: "Logout",  label: "Logout" },
              { value: "Created", label: "Created" },
              { value: "Updated", label: "Updated" },
              { value: "Deleted", label: "Deleted" },
            ]}
          />
          <FilterSelect
            label="Severity"
            value={panel.severity}
            onChange={(v) => f("severity", v)}
            options={[
              { value: "", label: "Select an option" },
              { value: "Info",    label: "Info" },
              { value: "Warning", label: "Warning" },
              { value: "Error",   label: "Error" },
              { value: "Success", label: "Success" },
            ]}
          />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Performed By (Email) <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={panel.email}
              onChange={(e) => f("email", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              From Date <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              type="date"
              value={panel.from}
              onChange={(e) => f("from", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              To Date <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              type="date"
              value={panel.to}
              onChange={(e) => f("to", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Search <span className="text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="Search in description..."
              value={panel.desc}
              onChange={(e) => f("desc", e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── DataTable — no title/subtitle here since we rendered them above ── */}
      <DataTable
        columns={COLUMNS}
        data={filteredData}
        filters={TABLE_FILTERS}
        searchKeys={["time", "severity", "category", "action", "performer", "email", "description"]}
        rowsPerPage={8}
        emptyMessage="No logs yet."
      />
    </div>
  );
}
import { Copy, Check, Eye, Pencil, Trash2, Loader2, AlertCircle, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid, FormField, FormInput, FormSelect,
  FormActions, FormSubmitButton, FormCancelButton,
} from "../../components/common/FormPage";
import { flatsAPI, projectsAPI } from "../../utils/apiService";

const STATUS_STYLES = {
  sold:      { bg: "#fde8e8", text: "#c0392b" },
  booked:    { bg: "#e8f0fe", text: "#1a5276" },
  available: { bg: "#eaf3de", text: "#3b6d11" },
  blocked:   { bg: "#fff8e1", text: "#b7800a" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: "#f1f1f1", text: "#555" };
  return (
    <span style={{ background: s.bg, color: s.text }}
      className="inline-block px-3 py-0.5 rounded-sm text-[12px] font-semibold capitalize whitespace-nowrap">
      {status}
    </span>
  );
}

function CopyableId({ id }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[12px] text-slate-600 truncate max-w-[100px]">{id}</span>
      <button onClick={() => { navigator.clipboard.writeText(id); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

const EMPTY_FORM = { project: "", flatNumber: "", floor: "", size: "", type: "", description: "" };

function AddUnitForm({ onBack, onSubmit, projects }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.project)    e.project    = "Project is required";
    if (!form.flatNumber) e.flatNumber = "Flat / Unit number is required";
    if (!form.floor)      e.floor      = "Floor number is required";
    if (!form.size)       e.size       = "Size is required";
    if (!form.type)       e.type       = "Unit type is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to create unit." });
      setLoading(false);
    }
  };

  return (
    <FormPage title="Add Unit" subtitle="Create a new flat / unit" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        {errors.api && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errors.api}</div>}
        <FormGrid>
          <FormField label="Project" required error={errors.project} fullWidth>
            <FormSelect value={form.project} onChange={set("project")} error={errors.project}>
              <option value="">Select project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </FormSelect>
          </FormField>
          <FormField label="Flat / Unit Number" required error={errors.flatNumber}>
            <FormInput placeholder="e.g. A-101" value={form.flatNumber} onChange={set("flatNumber")} error={errors.flatNumber} />
          </FormField>
          <FormField label="Floor Number" required error={errors.floor}>
            <FormInput type="number" placeholder="e.g. 1" value={form.floor} onChange={set("floor")} error={errors.floor} />
          </FormField>
          <FormField label="Size (sq ft)" required error={errors.size}>
            <FormInput type="number" placeholder="e.g. 950" value={form.size} onChange={set("size")} error={errors.size} />
          </FormField>
          <FormField label="Unit Type" required error={errors.type}>
            <FormSelect value={form.type} onChange={set("type")} error={errors.type}>
              <option value="">Select an option</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </FormSelect>
          </FormField>
          <FormField label="Description (Optional)" fullWidth>
            <textarea rows={4} placeholder="Optional details..." value={form.description} onChange={set("description")}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </FormField>
        </FormGrid>
        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>Add Unit</FormSubmitButton>
        </FormActions>
      </form>
    </FormPage>
  );
}

const COLUMNS = [
  { key: "_id",         label: "ID",           sortable: false, render: (v) => <CopyableId id={v} /> },
  { key: "flatNumber",  label: "Flat/Unit No",  sortable: true },
  { key: "project",     label: "Project",       sortable: true, render: (v) => v?.name || v },
  { key: "floor",       label: "Floor",         sortable: true },
  { key: "size",        label: "Size (Sq Ft)",  sortable: true },
  { key: "type",        label: "Type",          sortable: true },
  { key: "status",      label: "Status",        sortable: true, render: (v) => <StatusBadge status={v} /> },
  { key: "createdAt",   label: "Created At",    sortable: true, render: (v) => v ? new Date(v).toLocaleDateString("en-GB") : "-" },
];

const STATUS_FILTERS = [
  { key: "status", options: [
    { value: "", label: "All statuses" },
    { value: "available", label: "Available" },
    { value: "booked",    label: "Booked" },
    { value: "sold",      label: "Sold" },
    { value: "blocked",   label: "Blocked" },
  ]},
];

export default function FlatsPage() {
  const [view,      setView]      = useState("list");
  const [flats,     setFlats]     = useState([]);
  const [projects,  setProjects]  = useState([]);
  const [fetching,  setFetching]  = useState(true);
  const [fetchErr,  setFetchErr]  = useState("");
  const [toast,     setToast]     = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const loadData = useCallback(async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const [flatsRes, projRes] = await Promise.all([
        flatsAPI.getAll(1, 200),
        projectsAPI.getAll(1, 100),
      ]);
      setFlats(flatsRes.data.data || []);
      setProjects(projRes.data.data || []);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load data.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddSubmit = async (form) => {
    await flatsAPI.create({
      project:     form.project,
      flatNumber:  form.flatNumber,
      floor:       Number(form.floor),
      size:        Number(form.size),
      type:        form.type,
      description: form.description,
    });
    await loadData();
    setView("list");
    showToast(`Unit "${form.flatNumber}" created successfully!`);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete unit "${row.flatNumber}"?`)) return;
    try {
      await flatsAPI.delete(row._id);
      await loadData();
      showToast(`Unit "${row.flatNumber}" deleted.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.");
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={28} />
      <span className="ml-3 text-slate-500">Loading units...</span>
    </div>
  );

  if (fetchErr) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
      <AlertCircle size={18} /> {fetchErr}
      <button onClick={loadData} className="ml-4 underline text-sm">Retry</button>
    </div>
  );

  if (view === "add") return (
    <AddUnitForm onBack={() => setView("list")} onSubmit={handleAddSubmit} projects={projects} />
  );

  return (
    <div>
      <DataTable
        title="Units"
        subtitle="Manage all project units and flats"
        columns={COLUMNS}
        data={flats}
        filters={STATUS_FILTERS}
        searchKeys={["flatNumber", "type", "status"]}
        onAddClick={() => setView("add")}
        addLabel="+ Add Unit"
        addIcon={<Plus className="w-4 h-4" />}
        rowsPerPage={10}
        emptyMessage="No units found."
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-5 py-3.5 max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-slate-700 flex-1">{toast}</p>
        </div>
      )}
    </div>
  );
}

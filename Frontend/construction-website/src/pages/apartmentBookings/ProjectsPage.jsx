import { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid,
  FormField,
  FormInput,
  FormActions,
  FormSubmitButton,
  FormCancelButton,
} from "../../components/common/FormPage";
import { Plus, Copy, Eye, Edit2, Archive, Trash2, Check, X, Loader2, AlertCircle } from "lucide-react";
import { projectsAPI } from "../../utils/apiService";

function StatusBadge({ value }) {
  return value === "active" ? (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      Archived
    </span>
  );
}

function CopyableId({ id }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[12px] text-slate-600">{id}</span>
      <button
        onClick={() => { navigator.clipboard.writeText(id); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

const COLUMNS = [
  { key: "projectId",  label: "Project ID",   sortable: true, render: (v) => <CopyableId id={v} /> },
  { key: "name",       label: "Project Name", sortable: true },
  { key: "location",   label: "Location",     sortable: true },
  { key: "totalFloors",label: "Floors",       sortable: true },
  { key: "totalFlats", label: "Units",        sortable: true },
  { key: "status",     label: "Status",       sortable: true, render: (v) => <StatusBadge value={v} /> },
  {
    key: "createdAt",
    label: "Created At",
    sortable: true,
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB") : "-",
  },
];

const EMPTY = { name: "", location: "", totalFloors: "", totalFlats: "", description: "" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [view,     setView]     = useState("table");
  const [form,     setForm]     = useState(EMPTY);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [toast,    setToast]    = useState("");

  const loadProjects = useCallback(async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const res = await projectsAPI.getAll(1, 100);
      setProjects(res.data.data || []);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load projects.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const field = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); };

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  function validate() {
    const e = {};
    if (!form.name.trim())     e.name     = "Project name is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.totalFloors)     e.totalFloors = "Total floors are required.";
    if (!form.totalFlats)      e.totalFlats  = "Total units are required.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    try {
      await projectsAPI.create({
        name:        form.name.trim(),
        location:    form.location.trim(),
        totalFloors: Number(form.totalFloors),
        totalFlats:  Number(form.totalFlats),
        description: form.description.trim(),
      });
      await loadProjects();
      setForm(EMPTY);
      setErrors({});
      setView("table");
      showToast(`Project "${form.name.trim()}" created successfully!`);
    } catch (err) {
      setErrors((e) => ({ ...e, api: err.response?.data?.message || "Failed to create project." }));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Delete project "${row.name}"?`)) return;
    try {
      await projectsAPI.delete(row._id);
      await loadProjects();
      showToast(`Project "${row.name}" deleted.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.");
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={28} />
      <span className="ml-3 text-slate-500">Loading projects...</span>
    </div>
  );

  if (fetchErr) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
      <AlertCircle size={18} /> {fetchErr}
      <button onClick={loadProjects} className="ml-4 underline text-sm">Retry</button>
    </div>
  );

  return (
    <div>
      {view === "table" ? (
        <DataTable
          title="Projects"
          subtitle="Manage all apartment projects"
          columns={COLUMNS}
          data={projects}
          searchKeys={["projectId", "name", "location", "status"]}
          addLabel="Add Project"
          addIcon={<Plus className="w-4 h-4" strokeWidth={2.5} />}
          onAddClick={() => { setForm(EMPTY); setErrors({}); setView("create"); }}
          rowsPerPage={10}
          emptyMessage="No projects found."
        />
      ) : (
        <FormPage title="Create Project" subtitle="Add a new apartment project." onBack={() => setView("table")}>
          <form onSubmit={handleSubmit} noValidate>
            {errors.api && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errors.api}</div>
            )}
            <FormGrid>
              <FormField label="Project Name" required error={errors.name}>
                <FormInput placeholder="e.g. Blue Towers" value={form.name} onChange={(e) => field("name", e.target.value)} error={errors.name} autoFocus />
              </FormField>
              <FormField label="Location" required error={errors.location}>
                <FormInput placeholder="e.g. Hyderabad" value={form.location} onChange={(e) => field("location", e.target.value)} error={errors.location} />
              </FormField>
              <FormField label="Total Floors" required error={errors.totalFloors}>
                <FormInput type="number" placeholder="e.g. 10" value={form.totalFloors} onChange={(e) => field("totalFloors", e.target.value)} error={errors.totalFloors} />
              </FormField>
              <FormField label="Total Units" required error={errors.totalFlats}>
                <FormInput type="number" placeholder="e.g. 120" value={form.totalFlats} onChange={(e) => field("totalFlats", e.target.value)} error={errors.totalFlats} />
              </FormField>
              <div className="col-span-full">
                <FormField label="Description (Optional)">
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all min-h-[120px] resize-none"
                    placeholder="Optional project details..."
                    value={form.description}
                    onChange={(e) => field("description", e.target.value)}
                  />
                </FormField>
              </div>
            </FormGrid>
            <FormActions>
              <FormCancelButton onClick={() => setView("table")} />
              <FormSubmitButton loading={loading && "Creating..."}> Create Project </FormSubmitButton>
            </FormActions>
          </form>
        </FormPage>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-5 py-3.5 max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-slate-700 flex-1">{toast}</p>
          <button onClick={() => setToast("")} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>
      )}
    </div>
  );
}

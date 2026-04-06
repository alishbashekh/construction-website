import { useState } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid,
  FormField,
  FormInput,
  FormActions,
  FormSubmitButton,
  FormCancelButton,
} from "../../components/common/FormPage";
import {
  Plus,
  Copy,
  Eye,
  Edit2,
  Archive,
  Trash2,
  Check,
  X,
} from "lucide-react";

const ProjectsData = [
  {
    id: "PRJ-00003",
    name: "Test",
    location: "Hyderabad",
    floors: 10,
    units: 18,
    status: "Active",
    createdAt: "06/04/2026",
  },
  {
    id: "PRJ-00002",
    name: "Cevher",
    location: "Unit 7",
    floors: 7,
    units: 28,
    status: "Active",
    createdAt: "19/03/2026",
  },
  {
    id: "PRJ-00001",
    name: "Ottoman Heights",
    location: "Hyderabad",
    floors: 10,
    units: 120,
    status: "Active",
    createdAt: "17/03/2026",
  },
];

function StatusBadge({ value }) {
  return value === "Active" ? (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      Archived
    </span>
  );
}

const COLUMNS = [
  {
    key: "id",
    label: "Project ID",
    sortable: true,
    render: (v) => (
      <div className="flex items-center gap-2">
        <span>{v}</span>
        <Copy className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>
    ),
  },
  { key: "name", label: "Project Name", sortable: true },
  { key: "location", label: "Location", sortable: true },
  { key: "floors", label: "Floors", sortable: true },
  { key: "units", label: "Units", sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (v) => <StatusBadge value={v} />,
  },
  { key: "createdAt", label: "Created At", sortable: true },
  {
    key: "actions",
    label: "Action",
    render: () => (
      <div className="flex items-center gap-3">
        <Eye className="w-4 h-4 text-sky-500 cursor-pointer" />
        <Edit2 className="w-4 h-4 text-emerald-500 cursor-pointer" />
        <Archive className="w-4 h-4 text-orange-500 cursor-pointer" />
        <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
      </div>
    ),
  },
];

const EMPTY = {
  name: "",
  location: "",
  floors: "",
  units: "",
  description: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState(ProjectsData);
  const [view, setView] = useState("table");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const field = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Project name is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (!form.floors) e.floors = "Total floors are required.";
    if (!form.units) e.units = "Total units are required.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const n = projects.length + 1;

    setProjects((prev) => [
      {
        id: `PRJ-${String(n).padStart(5, "0")}`,
        name: form.name.trim(),
        location: form.location.trim(),
        floors: Number(form.floors),
        units: Number(form.units),
        description: form.description.trim(),
        status: "Active",
        createdAt: new Date().toLocaleDateString("en-GB"),
      },
      ...prev,
    ]);

    setLoading(false);
    setForm(EMPTY);
    setErrors({});
    setView("table");
    showToast(`Project "${form.name.trim()}" created successfully!`);
  }

  return (
    <div>
      {view === "table" ? (
        <DataTable
          title="Projects"
          subtitle="Manage all apartment projects"
          columns={COLUMNS}
          data={projects}
          searchKeys={["id", "name", "location", "floors", "units", "status"]}
          addLabel="Add Project"
          addIcon={<Plus className="w-4 h-4" strokeWidth={2.5} />}
          onAddClick={() => {
            setForm(EMPTY);
            setErrors({});
            setView("create");
          }}
          rowsPerPage={5}
          emptyMessage="No projects found."
        />
      ) : (
        <FormPage
          title="Create Project"
          subtitle="Add a new apartment project."
          onBack={() => setView("table")}
        >
          <form onSubmit={handleSubmit} noValidate>
            <FormGrid>
              <FormField label="Project Name" required error={errors.name}>
                <FormInput
                  placeholder="e.g. Blue Towers"
                  value={form.name}
                  onChange={(e) => field("name", e.target.value)}
                  error={errors.name}
                  autoFocus
                />
              </FormField>

              <FormField label="Location" required error={errors.location}>
                <FormInput
                  placeholder="e.g. Hyderabad"
                  value={form.location}
                  onChange={(e) => field("location", e.target.value)}
                  error={errors.location}
                />
              </FormField>

              <FormField label="Total Floors" required error={errors.floors}>
                <FormInput
                  type="number"
                  placeholder="e.g. 10"
                  value={form.floors}
                  onChange={(e) => field("floors", e.target.value)}
                  error={errors.floors}
                />
              </FormField>

              <FormField label="Total Units" required error={errors.units}>
                <FormInput
                  type="number"
                  placeholder="e.g. 120"
                  value={form.units}
                  onChange={(e) => field("units", e.target.value)}
                  error={errors.units}
                />
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
              <FormSubmitButton loading={loading && "Creating..."}>
                Create Project
              </FormSubmitButton>
            </FormActions>
          </form>
        </FormPage>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-5 py-3.5 animate-slide-up max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-slate-700 flex-1">{toast}</p>
          <button
            onClick={() => setToast("")}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

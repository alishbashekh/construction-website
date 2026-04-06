import { Copy, Check, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid,
  FormField,
  FormInput,
  FormSelect,
  FormActions,
  FormSubmitButton,
  FormCancelButton,
} from "../../components/common/FormPage";

const PROJECTS = ["Ottoman Heights", "Cevher", "Al Noor Residency"];

const SAMPLE_DATA = [
  { id: "69b85...8d43", flatNo: 101, project: "Ottoman Heights", floor: 1, size: 350,  type: "residential", status: "sold",      createdAt: "17/03/2026" },
  { id: "69bb3...d50a", flatNo: 101, project: "Cevher",          floor: 1, size: 1500, type: "residential", status: "booked",    createdAt: "19/03/2026" },
  { id: "69b85...8d5f", flatNo: 102, project: "Ottoman Heights", floor: 1, size: 350,  type: "residential", status: "booked",    createdAt: "17/03/2026" },
  { id: "69cbc...f55b", flatNo: 108, project: "Ottoman Heights", floor: 1, size: 400,  type: "residential", status: "booked",    createdAt: "31/03/2026" },
  { id: "69abc...1f2e", flatNo: 201, project: "Ottoman Heights", floor: 2, size: 500,  type: "residential", status: "available", createdAt: "01/04/2026" },
  { id: "69def...3a4c", flatNo: 202, project: "Cevher",          floor: 2, size: 750,  type: "residential", status: "sold",      createdAt: "02/04/2026" },
  { id: "69ghi...5b6d", flatNo: 301, project: "Ottoman Heights", floor: 3, size: 600,  type: "residential", status: "available", createdAt: "03/04/2026" },
  { id: "69jkl...7c8e", flatNo: 302, project: "Cevher",          floor: 3, size: 900,  type: "residential", status: "booked",    createdAt: "04/04/2026" },
  { id: "69mno...9d0f", flatNo: 401, project: "Ottoman Heights", floor: 4, size: 450,  type: "residential", status: "available", createdAt: "05/04/2026" },
  { id: "69pqr...1e2g", flatNo: 110, project: "Cevher",          floor: 1, size: 1200, type: "commercial",  status: "sold",      createdAt: "06/04/2026" },
  { id: "69stu...3f4h", flatNo: 210, project: "Ottoman Heights", floor: 2, size: 800,  type: "commercial",  status: "available", createdAt: "07/04/2026" },
  { id: "69vwx...5g6i", flatNo: 310, project: "Cevher",          floor: 3, size: 1100, type: "commercial",  status: "booked",    createdAt: "08/04/2026" },
];

const STATUS_STYLES = {
  sold:      { bg: "#fde8e8", text: "#c0392b" },
  booked:    { bg: "#e8f0fe", text: "#1a5276" },
  available: { bg: "#eaf3de", text: "#3b6d11" },
};

const EMPTY_FORM = { project: "", flatNo: "", floor: "", size: "", type: "", description: "" };

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: "#f1f1f1", text: "#555" };
  return (
    <span
      style={{ background: s.bg, color: s.text }}
      className="inline-block px-3 py-0.5 rounded-sm text-[12px] font-semibold capitalize whitespace-nowrap"
    >
      {status}
    </span>
  );
}

function CopyableId({ id }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[12px] text-slate-600">{id}</span>
      <button
        onClick={handleCopy}
        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
        title="Copy ID"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function ActionCell({ row, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => alert(`View: ${row.id}`)}
        className="p-1.5 rounded text-[#1a6fa8] hover:bg-blue-50 transition-colors"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => onEdit(row)}
        className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(row)}
        className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddUnitForm({ onBack, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.project) e.project = "Project is required";
    if (!form.flatNo)  e.flatNo  = "Flat / Unit number is required";
    if (!form.floor)   e.floor   = "Floor number is required";
    if (!form.size)    e.size    = "Size is required";
    if (!form.type)    e.type    = "Unit type is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    onSubmit(form);
  };

  return (
    <FormPage title="Add Unit" subtitle="Create a new flat / unit" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <FormField label="Project" required error={errors.project} fullWidth>
            <FormSelect value={form.project} onChange={set("project")} error={errors.project}>
              <option value="">Select project</option>
              {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </FormSelect>
          </FormField>

          <FormField label="Flat / Unit Number" required error={errors.flatNo}>
            <FormInput placeholder="e.g. A-101" value={form.flatNo} onChange={set("flatNo")} error={errors.flatNo} />
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
            <textarea
              rows={4}
              placeholder="Optional project details..."
              value={form.description}
              onChange={set("description")}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm
                text-slate-800 placeholder-slate-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </FormField>
        </FormGrid>

        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>
            Add Unit
          </FormSubmitButton>
        </FormActions>
      </form>
    </FormPage>
  );
}

const COLUMNS = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    render: (val) => <CopyableId id={val} />,
  },
  { key: "flatNo",    label: "Flat/Unit No", sortable: true },
  { key: "project",   label: "Project",      sortable: true },
  { key: "floor",     label: "Floor",        sortable: true },
  { key: "size",      label: "Size (Sq Ft)", sortable: true },
  { key: "type",      label: "Type",         sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  { key: "createdAt", label: "Created At",   sortable: true },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    render: (_, row) => (
      <ActionCell
        row={row}
        onEdit={() => alert(`Edit: ${row.id}`)}
        onDelete={() => { if (window.confirm(`Delete unit ${row.flatNo}?`)) alert(`Deleted: ${row.id}`); }}
      />
    ),
  },
];

export default function FlatsPage() {
  const [view, setView] = useState("list");

  if (view === "add") {
    return (
      <div className="p-6 w-full min-w-0">
        <AddUnitForm
          onBack={() => setView("list")}
          onSubmit={(data) => { console.log("New unit:", data); setView("list"); }}
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-hidden shrink-0">
      <DataTable
        title="Units"
        columns={COLUMNS}
        data={SAMPLE_DATA}
        filters={[]}
        searchKeys={["id", "flatNo", "project", "type", "status"]}
        onAddClick={() => setView("add")}
        addLabel="+ Add Unit"
        addIcon={null}
        rowsPerPage={8}
        emptyMessage="No units found."
      />
    </div>
  );
}
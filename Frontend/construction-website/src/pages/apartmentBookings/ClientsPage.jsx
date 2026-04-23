import { Copy, Check, Eye, Pencil, Trash2, Loader2, AlertCircle, Plus } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid, FormField, FormInput,
  FormActions, FormSubmitButton, FormCancelButton,
} from "../../components/common/FormPage";
import { clientsAPI } from "../../utils/apiService";

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

const EMPTY_FORM = { name: "", guardian: "", cnic: "", phone: "", email: "", address: "" };

function AddClientForm({ onBack, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name)     e.name     = "Client name is required";
    if (!form.guardian) e.guardian = "Guardian name is required";
    if (!form.cnic)     e.cnic     = "CNIC is required";
    if (!form.phone)    e.phone    = "Contact number is required";
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
      setErrors({ api: err.response?.data?.message || "Failed to create client." });
      setLoading(false);
    }
  };

  return (
    <FormPage title="Add Client" subtitle="Create a new client profile" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        {errors.api && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errors.api}</div>}
        <FormGrid>
          <FormField label="Client Name" required error={errors.name}>
            <FormInput placeholder="e.g. Nadeem Baig" value={form.name} onChange={set("name")} error={errors.name} autoFocus />
          </FormField>
          <FormField label="Guardian Name" required error={errors.guardian}>
            <FormInput placeholder="e.g. Ahmed Baig" value={form.guardian} onChange={set("guardian")} error={errors.guardian} />
          </FormField>
          <FormField label="CNIC" required error={errors.cnic}>
            <FormInput placeholder="e.g. 42101-1234567-1" value={form.cnic} onChange={set("cnic")} error={errors.cnic} />
          </FormField>
          <FormField label="Contact Number" required error={errors.phone}>
            <FormInput placeholder="e.g. +92 300 1234567" value={form.phone} onChange={set("phone")} error={errors.phone} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <FormInput type="email" placeholder="e.g. client@email.com" value={form.email} onChange={set("email")} error={errors.email} />
          </FormField>
          <FormField label="Address" error={errors.address}>
            <FormInput placeholder="e.g. House 12, Karachi" value={form.address} onChange={set("address")} error={errors.address} />
          </FormField>
        </FormGrid>
        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>Add Client</FormSubmitButton>
        </FormActions>
      </form>
    </FormPage>
  );
}

const COLUMNS = [
  { key: "clientId", label: "Client ID",  sortable: true, render: (v) => <CopyableId id={v} /> },
  { key: "name",     label: "Client Name",sortable: true },
  { key: "cnic",     label: "CNIC",       sortable: true },
  { key: "phone",    label: "Contact",    sortable: true },
  { key: "email",    label: "Email",      sortable: true },
  { key: "address",  label: "Address",    sortable: false },
  {
    key: "createdAt",
    label: "Joined",
    sortable: true,
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB") : "-",
  },
];

export default function ClientsPage() {
  const [view,     setView]     = useState("list");
  const [clients,  setClients]  = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const loadClients = useCallback(async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const res = await clientsAPI.getAll(1, 200);
      setClients(res.data.data || []);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load clients.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  const handleAddSubmit = async (form) => {
    await clientsAPI.create({
      name:     form.name,
      guardian: form.guardian,
      cnic:     form.cnic,
      phone:    form.phone,
      email:    form.email,
      address:  form.address,
    });
    await loadClients();
    setView("list");
    showToast(`Client "${form.name}" added successfully!`);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete client "${row.name}"?`)) return;
    try {
      await clientsAPI.delete(row._id);
      await loadClients();
      showToast(`Client "${row.name}" deleted.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.");
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={28} />
      <span className="ml-3 text-slate-500">Loading clients...</span>
    </div>
  );

  if (fetchErr) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
      <AlertCircle size={18} /> {fetchErr}
      <button onClick={loadClients} className="ml-4 underline text-sm">Retry</button>
    </div>
  );

  if (view === "add") return (
    <AddClientForm onBack={() => setView("list")} onSubmit={handleAddSubmit} />
  );

  return (
    <div>
      <DataTable
        title="Clients"
        subtitle="Manage all client profiles"
        columns={COLUMNS}
        data={clients}
        filters={[]}
        searchKeys={["clientId", "name", "cnic", "phone", "email"]}
        onAddClick={() => setView("add")}
        addLabel="+ Add Client"
        addIcon={<Plus className="w-4 h-4" />}
        rowsPerPage={10}
        emptyMessage="No clients found."
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

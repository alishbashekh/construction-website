import { Copy, Check, Eye, Pencil, Trash2 } from "lucide-react";
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

const SAMPLE_DATA = [
  { id: "69bb3...c910", clientName: "Nadeem Baig",    cnic: "24928-2382938-3", contact: "+29 838 2938239", address: "88383838 3NNDFN" },
  { id: "69bb3...c902", clientName: "Syed Faraz Ali", cnic: "23498-7498237-4", contact: "+89 327 9847892", address: "jhfcjsdbjcbsd dscfbjsdncjknck" },
  { id: "69bb3...c8f4", clientName: "Jameel Khan",    cnic: "73475-9387349-2", contact: "+89 472 9873298", address: "vkhcsd hsk vhks" },
  { id: "69bb3...c8e6", clientName: "Nadeem Shaikh",  cnic: "43245-6538473-8", contact: "+73 838 3883883", address: "jsdncljsj lsdncvsldn svnsl" },
  { id: "69bb3...c7a1", clientName: "Arif Hussain",   cnic: "35201-1234567-9", contact: "+92 300 1234567", address: "House 12, Street 4, Karachi" },
  { id: "69bb3...c7b2", clientName: "Fatima Malik",   cnic: "42101-9876543-1", contact: "+92 321 9876543", address: "Block C, Gulshan-e-Iqbal" },
  { id: "69bb3...c7c3", clientName: "Omar Sheikh",    cnic: "61101-5647382-5", contact: "+92 333 5647382", address: "F-7 Markaz, Islamabad" },
  { id: "69bb3...c7d4", clientName: "Hina Qureshi",   cnic: "37405-2938475-3", contact: "+92 345 2938475", address: "Johar Town, Lahore" },
  { id: "69bb3...c7e5", clientName: "Bilal Ahmed",    cnic: "54400-1122334-7", contact: "+92 311 1122334", address: "Model Town, Lahore" },
  { id: "69bb3...c7f6", clientName: "Saima Noor",     cnic: "38401-6677889-2", contact: "+92 312 6677889", address: "Clifton, Karachi" },
  { id: "69bb3...c7g7", clientName: "Tariq Mehmood",  cnic: "31202-4455667-6", contact: "+92 322 4455667", address: "Saddar, Rawalpindi" },
  { id: "69bb3...c7h8", clientName: "Zara Iqbal",     cnic: "42201-9988776-4", contact: "+92 301 9988776", address: "DHA Phase 5, Karachi" },
];

const EMPTY_FORM = { clientName: "", cnic: "", contact: "", email: "", address: "" };

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
      <button onClick={handleCopy} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0" title="Copy ID">
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function ActionCell({ row, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => alert(`View: ${row.id}`)} className="p-1.5 rounded text-[#1a6fa8] hover:bg-blue-50 transition-colors" title="View">
        <Eye className="w-4 h-4" />
      </button>
      <button onClick={() => onEdit(row)} className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="Edit">
        <Pencil className="w-4 h-4" />
      </button>
      <button onClick={() => onDelete(row)} className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddClientForm({ onBack, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.clientName) e.clientName = "Client name is required";
    if (!form.cnic)       e.cnic       = "CNIC is required";
    if (!form.contact)    e.contact    = "Contact number is required";
    if (!form.address)    e.address    = "Address is required";
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
    <FormPage title="Add Client" subtitle="Create a new client profile" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <FormField label="Client Name" required error={errors.clientName}>
            <FormInput placeholder="e.g. Nadeem Baig" value={form.clientName} onChange={set("clientName")} error={errors.clientName} />
          </FormField>

          <FormField label="CNIC" required error={errors.cnic}>
            <FormInput placeholder="e.g. 42101-1234567-1" value={form.cnic} onChange={set("cnic")} error={errors.cnic} />
          </FormField>

          <FormField label="Contact Number" required error={errors.contact}>
            <FormInput placeholder="e.g. +92 300 1234567" value={form.contact} onChange={set("contact")} error={errors.contact} />
          </FormField>

          <FormField label="Email" error={errors.email}>
            <FormInput type="email" placeholder="e.g. client@email.com" value={form.email} onChange={set("email")} error={errors.email} />
          </FormField>

          <FormField label="Address" required error={errors.address} fullWidth>
            <textarea
              rows={3}
              placeholder="e.g. House 12, Street 4, Karachi"
              value={form.address}
              onChange={set("address")}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm
                text-slate-800 placeholder-slate-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-0.5">{errors.address}</p>
            )}
          </FormField>
        </FormGrid>

        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>
            Add Client
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
  { key: "clientName", label: "Client Name", sortable: true },
  { key: "cnic",       label: "CNIC",        sortable: true },
  { key: "contact",    label: "Contact",      sortable: true },
  { key: "address",    label: "Address",      sortable: true },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    render: (_, row) => (
      <ActionCell
        row={row}
        onEdit={() => alert(`Edit: ${row.id}`)}
        onDelete={() => { if (window.confirm(`Delete client ${row.clientName}?`)) alert(`Deleted: ${row.id}`); }}
      />
    ),
  },
];

export default function ClientsPage() {
  const [view, setView] = useState("list");

  if (view === "add") {
    return (
      <div className="p-6 w-full min-w-0">
        <AddClientForm
          onBack={() => setView("list")}
          onSubmit={(data) => { console.log("New client:", data); setView("list"); }}
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-hidden shrink-0">
      <DataTable
        title="Clients"
        subtitle="Manage all client profiles"
        columns={COLUMNS}
        data={SAMPLE_DATA}
        filters={[]}
        searchKeys={["id", "clientName", "cnic", "contact", "address"]}
        onAddClick={() => setView("add")}
        addLabel="+ Add Client"
        addIcon={null}
        rowsPerPage={8}
        emptyMessage="No clients found."
      />
    </div>
  );
}
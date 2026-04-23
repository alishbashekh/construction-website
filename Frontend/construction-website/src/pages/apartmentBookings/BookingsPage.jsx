import { Eye, RefreshCw, XCircle, Plus, Loader2, AlertCircle, Check, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid, FormField, FormInput, FormSelect,
  FormActions, FormSubmitButton, FormCancelButton,
} from "../../components/common/FormPage";
import { bookingsAPI, projectsAPI, clientsAPI, flatsAPI } from "../../utils/apiService";

const PAYMENT_PLANS = ["Installments", "Full Payment", "Lump Sum"];

function formatPrice(amount) {
  return `Rs ${Number(amount).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatusBadge({ status }) {
  const styles = {
    active:      "bg-green-50 text-green-700 border border-green-200",
    pending:     "bg-yellow-50 text-yellow-700 border border-yellow-200",
    completed:   "bg-blue-50 text-blue-700 border border-blue-200",
    cancelled:   "bg-red-50 text-red-700 border border-red-200",
    transferred: "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function ActionCell({ row, onCancel }) {
  const done = row.status === "completed" || row.status === "cancelled";
  return (
    <div className="flex items-center gap-0.5">
      <button className="p-1.5 rounded text-[#1a6fa8] hover:bg-blue-50 transition-colors" title="View">
        <Eye className="w-4 h-4" />
      </button>
      {!done && (
        <button
          onClick={() => onCancel(row)}
          className="p-1.5 rounded text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Cancel"
        >
          <XCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

const EMPTY_FORM = { project: "", flat: "", client: "", bookingDate: "", bookingPrice: "", paymentPlan: "" };

function AddBookingForm({ onBack, onSubmit, projects, clients, flats }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Filter available flats by selected project
  const availableFlats = flats.filter(
    (f) => f.status === "available" && (!form.project || f.project?._id === form.project || f.project === form.project)
  );

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.project)      e.project      = "Project is required";
    if (!form.flat)         e.flat         = "Unit is required";
    if (!form.client)       e.client       = "Client is required";
    if (!form.bookingDate)  e.bookingDate  = "Booking date is required";
    if (!form.bookingPrice) e.bookingPrice = "Price is required";
    if (!form.paymentPlan)  e.paymentPlan  = "Payment plan is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, bookingPrice: Number(form.bookingPrice) });
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to create booking." });
      setLoading(false);
    }
  };

  return (
    <FormPage title="New Booking" subtitle="Create a new flat booking" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        {errors.api && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errors.api}</div>}
        <FormGrid>
          <FormField label="Project" required error={errors.project}>
            <FormSelect value={form.project} onChange={set("project")} error={errors.project}>
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </FormSelect>
          </FormField>

          <FormField label="Unit / Flat" required error={errors.flat}>
            <FormSelect value={form.flat} onChange={set("flat")} error={errors.flat}>
              <option value="">Select available unit…</option>
              {availableFlats.map((f) => (
                <option key={f._id} value={f._id}>{f.flatNumber} – Floor {f.floor}</option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Client" required error={errors.client}>
            <FormSelect value={form.client} onChange={set("client")} error={errors.client}>
              <option value="">Select client…</option>
              {clients.map((c) => <option key={c._id} value={c._id}>{c.name} ({c.clientId})</option>)}
            </FormSelect>
          </FormField>

          <FormField label="Booking Date" required error={errors.bookingDate}>
            <FormInput type="date" value={form.bookingDate} onChange={set("bookingDate")} error={errors.bookingDate} />
          </FormField>

          <FormField label="Booking Price (Rs)" required error={errors.bookingPrice}>
            <FormInput type="number" placeholder="e.g. 5000000" value={form.bookingPrice} onChange={set("bookingPrice")} error={errors.bookingPrice} />
          </FormField>

          <FormField label="Payment Plan" required error={errors.paymentPlan}>
            <FormSelect value={form.paymentPlan} onChange={set("paymentPlan")} error={errors.paymentPlan}>
              <option value="">Select plan…</option>
              {PAYMENT_PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </FormSelect>
          </FormField>
        </FormGrid>
        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>Add Booking</FormSubmitButton>
        </FormActions>
      </form>
    </FormPage>
  );
}

const COLUMNS = [
  { key: "bookingNumber", label: "Booking #",    sortable: true },
  { key: "project",       label: "Project",      sortable: true, render: (v) => v?.name || "-" },
  { key: "flat",          label: "Unit",         sortable: true, render: (v) => v?.flatNumber || "-" },
  { key: "client",        label: "Client",       sortable: true, render: (v) => v?.name || "-" },
  {
    key: "bookingDate",
    label: "Booking Date",
    sortable: true,
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB") : "-",
  },
  {
    key: "bookingPrice",
    label: "Price",
    sortable: true,
    render: (v) => <span className="font-semibold text-slate-800">{formatPrice(v)}</span>,
  },
  { key: "paymentPlan", label: "Payment Plan", sortable: true },
  { key: "status",      label: "Status",       sortable: true, render: (v) => <StatusBadge status={v} /> },
];

const STATUS_FILTERS = [
  { key: "status", options: [
    { value: "",            label: "All statuses" },
    { value: "active",      label: "Active" },
    { value: "completed",   label: "Completed" },
    { value: "cancelled",   label: "Cancelled" },
    { value: "transferred", label: "Transferred" },
  ]},
];

export default function BookingsPage() {
  const [view,     setView]     = useState("list");
  const [bookings, setBookings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clients,  setClients]  = useState([]);
  const [flats,    setFlats]    = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const loadData = useCallback(async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const [bRes, pRes, cRes, fRes] = await Promise.all([
        bookingsAPI.getAll(1, 200),
        projectsAPI.getAll(1, 100),
        clientsAPI.getAll(1, 200),
        flatsAPI.getAll(1, 500),
      ]);
      setBookings(bRes.data.data || []);
      setProjects(pRes.data.data || []);
      setClients(cRes.data.data || []);
      setFlats(fRes.data.data || []);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load bookings.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddSubmit = async (form) => {
    await bookingsAPI.create(form);
    await loadData();
    setView("list");
    showToast("Booking created successfully!");
  };

  const handleCancel = async (row) => {
    const reason = window.prompt(`Cancel booking ${row.bookingNumber}?\nReason (optional):`);
    if (reason === null) return; // user pressed Cancel on prompt
    try {
      await bookingsAPI.cancel(row._id, reason);
      await loadData();
      showToast(`Booking ${row.bookingNumber} cancelled.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Cancel failed.");
    }
  };

  const columnsWithActions = [
    ...COLUMNS,
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_, row) => <ActionCell row={row} onCancel={handleCancel} />,
    },
  ];

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={28} />
      <span className="ml-3 text-slate-500">Loading bookings...</span>
    </div>
  );

  if (fetchErr) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
      <AlertCircle size={18} /> {fetchErr}
      <button onClick={loadData} className="ml-4 underline text-sm">Retry</button>
    </div>
  );

  if (view === "add") return (
    <AddBookingForm
      onBack={() => setView("list")}
      onSubmit={handleAddSubmit}
      projects={projects}
      clients={clients}
      flats={flats}
    />
  );

  return (
    <div>
      <DataTable
        title="Bookings"
        subtitle="Manage flat bookings & transfers"
        columns={columnsWithActions}
        data={bookings}
        filters={STATUS_FILTERS}
        searchKeys={["bookingNumber", "paymentPlan", "status"]}
        onAddClick={() => setView("add")}
        addLabel="+ New Booking"
        addIcon={<Plus className="w-4 h-4" />}
        rowsPerPage={10}
        emptyMessage="No bookings found."
      />

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

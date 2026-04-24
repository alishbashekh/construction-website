import { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid, FormField, FormSelect, FormInput,
  FormActions, FormSubmitButton, FormCancelButton,
} from "../../components/common/FormPage";
import { Plus, Check, X, Loader2, AlertCircle } from "lucide-react";
import { paymentsAPI, bookingsAPI, clientsAPI } from "../../utils/apiService";

const PAYMENT_MODES = ["cash", "bank", "cheque", "online"];
const PAYMENT_TYPES = ["regular", "advance", "installment"];

function formatPrice(amount) {
  return `Rs ${Number(amount).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TypeBadge({ value }) {
  const styles = {
    regular:     "bg-blue-50 text-blue-700 border border-blue-200",
    advance:     "bg-purple-50 text-purple-700 border border-purple-200",
    installment: "bg-green-50 text-green-700 border border-green-200",
  };
  const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : "-";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[value] ?? "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}

function ModeBadge({ value }) {
  const styles = {
    cash:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
    bank:   "bg-sky-50 text-sky-700 border border-sky-200",
    cheque: "bg-amber-50 text-amber-700 border border-amber-200",
    online: "bg-violet-50 text-violet-700 border border-violet-200",
  };
  const label = value ? value.charAt(0).toUpperCase() + value.slice(1) : "-";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[value] ?? "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}

const COLUMNS = [
  { key: "receiptNumber", label: "Receipt #",    sortable: true },
  { key: "flat",          label: "Unit",         sortable: true, render: (v) => v?.flatNumber || "-" },
  { key: "client",        label: "Client",       sortable: true, render: (v) => v?.name || "-" },
  { key: "type",          label: "Type",         sortable: true, render: (v) => <TypeBadge value={v} /> },
  { key: "paymentMode",   label: "Mode",         sortable: true, render: (v) => <ModeBadge value={v} /> },
 ,
  {
    key: "paymentDate",
    label: "Date",
    sortable: true,
    render: (v) => v ? new Date(v).toLocaleDateString("en-GB") : "-",
  },
  {
    key: "amount",
    label: "Amount",
    sortable: true,
    render: (v) => <span className="font-semibold text-slate-800">{formatPrice(v)}</span>,
  },
];

const MODE_FILTERS = [
  { key: "paymentMode", options: [
    { value: "",       label: "All modes" },
    { value: "cash",   label: "Cash" },
    { value: "bank",   label: "Bank" },
    { value: "cheque", label: "Cheque" },
    { value: "online", label: "Online" },
  ]},
];

const EMPTY_FORM = { booking: "", client: "", flat: "", project: "", amount: "", type: "regular", paymentMode: "", paymentDate: "", description: "" };

function AddPaymentForm({ onBack, onSubmit, bookings, clients }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); };

  // Auto-fill client/flat/project when booking is selected
  const handleBookingChange = (e) => {
    const bookingId = e.target.value;
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setForm((f) => ({
        ...f,
        booking: bookingId,
        client:  booking.client?._id || booking.client || "",
        flat:    booking.flat?._id   || booking.flat   || "",
        project: booking.project?._id || booking.project || "",
      }));
    } else {
      setForm((f) => ({ ...f, booking: bookingId, client: "", flat: "", project: "" }));
    }
    setErrors((er) => ({ ...er, booking: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.booking)     e.booking     = "Booking is required";
    if (!form.amount)      e.amount      = "Amount is required";
    if (!form.paymentMode) e.paymentMode = "Payment mode is required";
    if (!form.paymentDate) e.paymentDate = "Payment date is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Failed to record payment." });
      setLoading(false);
    }
  };

  return (
    <FormPage title="Record Payment" subtitle="Enter a new client payment" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        {errors.api && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{errors.api}</div>}
        <FormGrid>
          <FormField label="Booking" required error={errors.booking} fullWidth>
            <FormSelect value={form.booking} onChange={handleBookingChange} error={errors.booking}>
              <option value="">Select booking…</option>
              {bookings.filter((b) => b.status === "active").map((b) => (
                <option key={b._id} value={b._id}>
                  {b.bookingNumber} – {b.client?.name || ""} ({b.flat?.flatNumber || ""})
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Amount (Rs)" required error={errors.amount}>
            <FormInput type="number" placeholder="e.g. 500000" value={form.amount} onChange={set("amount")} error={errors.amount} />
          </FormField>

          <FormField label="Payment Mode" required error={errors.paymentMode}>
            <FormSelect value={form.paymentMode} onChange={set("paymentMode")} error={errors.paymentMode}>
              <option value="">Select mode…</option>
              {PAYMENT_MODES.map((m) => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </FormSelect>
          </FormField>

          <FormField label="Payment Type" error={errors.type}>
            <FormSelect value={form.type} onChange={set("type")} error={errors.type}>
              {PAYMENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </FormSelect>
          </FormField>

          <FormField label="Payment Date" required error={errors.paymentDate}>
            <FormInput type="date" value={form.paymentDate} onChange={set("paymentDate")} error={errors.paymentDate} />
          </FormField>

          <FormField label="Description (Optional)" fullWidth>
            <textarea rows={3} placeholder="Optional notes..." value={form.description} onChange={set("description")}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </FormField>
        </FormGrid>
        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>Record Payment</FormSubmitButton>
        </FormActions>
      </form>
    </FormPage>
  );
}

export default function ClientPayments() {
  const [view,     setView]     = useState("list");
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [clients,  setClients]  = useState([]);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const [toast,    setToast]    = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const loadData = useCallback(async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const [pRes, bRes, cRes] = await Promise.all([
        paymentsAPI.getAll(1, 200),
        bookingsAPI.getAll(1, 200),
        clientsAPI.getAll(1, 200),
      ]);
      setPayments(pRes.data.data || []);
      setBookings(bRes.data.data || []);
      setClients(cRes.data.data || []);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load payments.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddSubmit = async (form) => {
    await paymentsAPI.create(form);
    await loadData();
    setView("list");
    showToast("Payment recorded successfully!");
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-500" size={28} />
      <span className="ml-3 text-slate-500">Loading payments...</span>
    </div>
  );

  if (fetchErr) return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
      <AlertCircle size={18} /> {fetchErr}
      <button onClick={loadData} className="ml-4 underline text-sm">Retry</button>
    </div>
  );

  if (view === "add") return (
    <AddPaymentForm onBack={() => setView("list")} onSubmit={handleAddSubmit} bookings={bookings} clients={clients} />
  );

  return (
    <div>
      <DataTable
        title="Client Payments"
        subtitle="All payment receipts and records"
        columns={COLUMNS}
        data={payments}
        filters={MODE_FILTERS}
        searchKeys={["receiptNumber", "paymentMode", "type"]}
        onAddClick={() => setView("add")}
        addLabel="+ Record Payment"
        addIcon={<Plus className="w-4 h-4" />}
        rowsPerPage={10}
        emptyMessage="No payments found."
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

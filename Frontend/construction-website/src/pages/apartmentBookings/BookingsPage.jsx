import { Eye, RefreshCw, XCircle } from "lucide-react";
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
  { id: "BKG-00012", project: "Ottoman Heights", unit: "108", client: "Sameer Shaikh",  bookingDate: "31/03/2026", price: 3000000,  paymentPlan: "Installments", status: "Active"    },
  { id: "BKG-00011", project: "Ottoman Heights", unit: "401", client: "Samantha Hurst", bookingDate: "31/03/2026", price: 5000000,  paymentPlan: "Installments", status: "Active"    },
  { id: "BKG-00010", project: "Cevher",          unit: "401", client: "Nadeem Baig",    bookingDate: "19/03/2026", price: 27500000, paymentPlan: "Full Payment", status: "Completed" },
  { id: "BKG-00009", project: "Cevher",          unit: "301", client: "Syed Faraz Ali", bookingDate: "19/03/2026", price: 30000000, paymentPlan: "Installments", status: "Active"    },
  { id: "BKG-00008", project: "Ottoman Heights", unit: "205", client: "Jameel Khan",    bookingDate: "15/03/2026", price: 8000000,  paymentPlan: "Installments", status: "Active"    },
  { id: "BKG-00007", project: "Cevher",          unit: "102", client: "Nadeem Shaikh",  bookingDate: "10/03/2026", price: 12000000, paymentPlan: "Full Payment", status: "Completed" },
  { id: "BKG-00006", project: "Ottoman Heights", unit: "307", client: "Arif Hussain",   bookingDate: "05/03/2026", price: 4500000,  paymentPlan: "Installments", status: "Pending"   },
  { id: "BKG-00005", project: "Cevher",          unit: "203", client: "Fatima Malik",   bookingDate: "28/02/2026", price: 18000000, paymentPlan: "Installments", status: "Active"    },
  { id: "BKG-00004", project: "Ottoman Heights", unit: "110", client: "Omar Sheikh",    bookingDate: "20/02/2026", price: 6500000,  paymentPlan: "Full Payment", status: "Completed" },
  { id: "BKG-00003", project: "Cevher",          unit: "404", client: "Hina Qureshi",   bookingDate: "15/02/2026", price: 22000000, paymentPlan: "Installments", status: "Active"    },
  { id: "BKG-00002", project: "Ottoman Heights", unit: "502", client: "Bilal Ahmed",    bookingDate: "10/02/2026", price: 9000000,  paymentPlan: "Installments", status: "Pending"   },
  { id: "BKG-00001", project: "Cevher",          unit: "101", client: "Saima Noor",     bookingDate: "01/02/2026", price: 15000000, paymentPlan: "Full Payment", status: "Completed" },
];

const PROJECTS      = ["Ottoman Heights", "Cevher"];
const PAYMENT_PLANS = ["Installments", "Full Payment"];
const STATUSES      = ["Active", "Pending", "Completed"];

const EMPTY_FORM = {
  project: "", unit: "", client: "", bookingDate: "", price: "", paymentPlan: "", status: "Active",
};

function formatPrice(amount) {
  return `Rs ${Number(amount).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatusBadge({ status }) {
  const styles = {
    Active:    "bg-green-50 text-green-700 border border-green-200",
    Pending:   "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Completed: "bg-blue-50 text-blue-700 border border-blue-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function ActionCell({ row, onCancel }) {
  const done = row.status === "Completed";
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => alert(`View: ${row.id}`)}
        className="p-1.5 rounded text-[#1a6fa8] hover:bg-blue-50 transition-colors"
        title="View"
      >
        <Eye className="w-4 h-4" />
      </button>
      {!done && (
        <button
          onClick={() => alert(`Transfer: ${row.id}`)}
          className="p-1.5 rounded text-amber-500 hover:bg-amber-50 transition-colors"
          title="Transfer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
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

function AddBookingForm({ onBack, onSubmit }) {
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.project)     e.project     = "Project is required";
    if (!form.unit)        e.unit        = "Unit is required";
    if (!form.client)      e.client      = "Client is required";
    if (!form.bookingDate) e.bookingDate = "Booking date is required";
    if (!form.price)       e.price       = "Price is required";
    if (!form.paymentPlan) e.paymentPlan = "Payment plan is required";
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

  const selectClass = (hasError) =>
    `w-full px-4 py-3 rounded-lg border ${hasError ? "border-red-400" : "border-slate-200"} bg-white text-sm
     text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`;

  return (
    <FormPage title="New Booking" subtitle="Create a new flat booking" onBack={onBack}>
      <form onSubmit={handleSubmit} noValidate>
        <FormGrid>
          <FormField label="Project" required error={errors.project}>
            <select value={form.project} onChange={set("project")} className={selectClass(errors.project)}>
              <option value="">Select project…</option>
              {PROJECTS.map((p) => <option key={p}>{p}</option>)}
            </select>
            {errors.project && <p className="text-red-500 text-xs mt-0.5">{errors.project}</p>}
          </FormField>

          <FormField label="Unit / Flat No." required error={errors.unit}>
            <FormInput placeholder="e.g. 108" value={form.unit} onChange={set("unit")} error={errors.unit} />
          </FormField>

          <FormField label="Client" required error={errors.client}>
            <FormInput placeholder="e.g. Nadeem Baig" value={form.client} onChange={set("client")} error={errors.client} />
          </FormField>

          <FormField label="Booking Date" required error={errors.bookingDate}>
            <FormInput type="date" value={form.bookingDate} onChange={set("bookingDate")} error={errors.bookingDate} />
          </FormField>

          <FormField label="Price (Rs)" required error={errors.price}>
            <FormInput type="number" placeholder="e.g. 5000000" value={form.price} onChange={set("price")} error={errors.price} />
          </FormField>

          <FormField label="Payment Plan" required error={errors.paymentPlan}>
            <select value={form.paymentPlan} onChange={set("paymentPlan")} className={selectClass(errors.paymentPlan)}>
              <option value="">Select plan…</option>
              {PAYMENT_PLANS.map((p) => <option key={p}>{p}</option>)}
            </select>
            {errors.paymentPlan && <p className="text-red-500 text-xs mt-0.5">{errors.paymentPlan}</p>}
          </FormField>

          <FormField label="Status">
            <select value={form.status} onChange={set("status")} className={selectClass(false)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
        </FormGrid>

        <FormActions>
          <FormCancelButton onClick={onBack} />
          <FormSubmitButton loading={loading ? "Saving..." : null}>
            Add Booking
          </FormSubmitButton>
        </FormActions>
      </form>
    </FormPage>
  );
}

const COLUMNS = [
  { key: "id",          label: "Booking Number", sortable: true },
  { key: "project",     label: "Project",        sortable: true },
  { key: "unit",        label: "Unit",           sortable: true },
  { key: "client",      label: "Client",         sortable: true },
  { key: "bookingDate", label: "Booking Date",   sortable: true },
  {
    key: "price",
    label: "Price",
    sortable: true,
    render: (val) => <span className="font-semibold text-slate-800">{formatPrice(val)}</span>,
  },
  { key: "paymentPlan", label: "Payment Plan",   sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
    render: (_, row) => (
      <ActionCell
        row={row}
        onCancel={() => { if (window.confirm(`Cancel booking ${row.id}?`)) alert(`Cancelled: ${row.id}`); }}
      />
    ),
  },
];

export default function BookingsPage() {
  const [view, setView] = useState("list");

  if (view === "add") {
    return (
      <div className="p-6 w-full min-w-0">
        <AddBookingForm
          onBack={() => setView("list")}
          onSubmit={(data) => { console.log("New booking:", data); setView("list"); }}
        />
      </div>
    );
  }

  return (
    <div className="overflow-y-hidden shrink-0">
      <DataTable
        title="Bookings"
        subtitle="Manage flat bookings & transfers"
        columns={COLUMNS}
        data={SAMPLE_DATA}
        filters={[]}
        searchKeys={["id", "project", "unit", "client", "paymentPlan", "status"]}
        onAddClick={() => setView("add")}
        addLabel="+ New Booking"
        addIcon={null}
        rowsPerPage={8}
        emptyMessage="No bookings found."
      />
    </div>
  );
}
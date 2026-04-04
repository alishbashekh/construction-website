import { useState } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid,
  FormField,
  FormSelect,
  FormInput,
  FormActions,
  FormSubmitButton,
  FormCancelButton,
} from "../../components/common/FormPage";
import { Plus, Check, X } from "lucide-react"; // Swapped to Lucide

const UsersData = [
  {
    id: "PAY-00020",
    booking: "BKG-00012",
    project: "Ottoman Heights",
    unit: "108",
    client: "Sameer Shaikh",
    type: "regular",
    mode: "cash",
    receipt: "PAY-00020",
    date: "31/03/2025",
    amount: "500000",
  },
  {
    id: "PAY-00019",
    booking: "BKG-00011",
    project: "Ottoman Heights",
    unit: "401",
    client: "Samantha Hurst",
    type: "regular",
    mode: "cash",
    receipt: "PAY-00019",
    date: "31/03/2025",
    amount: "750000",
  },
  {
    id: "PAY-00017",
    booking: "BKG-00010",
    project: "Cevher",
    unit: "401",
    client: "Nadeem Baig",
    type: "regular",
    mode: "cash",
    receipt: "PAY-00017",
    date: "19/03/2025",
    amount: "300000",
  },
  {
    id: "PAY-00004",
    booking: "BKG-00002",
    project: "Ottoman Heights",
    unit: "102",
    client: "Bilal Ajmery",
    type: "regular",
    mode: "cash",
    receipt: "PAY-00004",
    date: "17/03/2025",
    amount: "450000",
  },
  {
    id: "PAY-00003",
    booking: "BKG-00003",
    project: "Cevher",
    unit: "205",
    client: "Sara Ahmed",
    type: "advance",
    mode: "bank",
    receipt: "PAY-00003",
    date: "10/03/2025",
    amount: "1000000",
  },
  {
    id: "PAY-00002",
    booking: "BKG-00005",
    project: "Green Valley",
    unit: "301",
    client: "Usman Malik",
    type: "advance",
    mode: "cheque",
    receipt: "PAY-00002",
    date: "05/03/2025",
    amount: "200000",
  },
  {
    id: "PAY-00001",
    booking: "BKG-00001",
    project: "Green Valley",
    unit: "101",
    client: "Razia Sultana",
    type: "regular",
    mode: "bank",
    receipt: "PAY-00001",
    date: "01/03/2025",
    amount: "650000",
  },
];

const PROJECTS = ["Ottoman Heights", "Cevher", "Green Valley"];
const UNITS = {
  "Ottoman Heights": ["102", "108", "205", "401"],
  Cevher: ["205", "401"],
  "Green Valley": ["101", "301"],
};
const CLIENTS = [
  "Sameer Shaikh",
  "Samantha Hurst",
  "Nadeem Baig",
  "Bilal Ajmery",
  "Sara Ahmed",
  "Usman Malik",
  "Razia Sultana",
];

const COLUMNS = [
  { key: "booking", label: "Booking Number", sortable: true },
  { key: "project", label: "Project", sortable: true },
  { key: "unit", label: "Unit", sortable: true },
  { key: "client", label: "Client", sortable: true },
  { key: "type", label: "Payment Type", sortable: true },
  { key: "mode", label: "Mode", sortable: true },
  { key: "receipt", label: "Receipt No", sortable: true },
  {
    key: "date",
    label: "Payment Date",
    sortable: true,
    render: (v) => <span className="font-semibold">{v}</span>,
  },
];

const EMPTY = {
  project: "",
  unit: "",
  client: "",
  type: "Regular",
  mode: "",
  amount: "",
  date: "",
};

export default function ClientPayments() {
  const [payments, setPayments] = useState(UsersData);
  const [view, setView] = useState("table");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const f = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const setProject = (v) => {
    setForm((p) => ({ ...p, project: v, unit: "" }));
    setErrors((e) => ({ ...e, project: "", unit: "" }));
  };

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function validate() {
    const e = {};
    if (!form.project) e.project = "Select a project.";
    if (!form.unit) e.unit = "Select a unit.";
    if (!form.client) e.client = "Select a client.";
    if (!form.mode) e.mode = "Select payment mode.";
    if (!form.amount.trim()) e.amount = "Amount is required.";
    else if (isNaN(form.amount) || +form.amount <= 0)
      e.amount = "Enter a valid amount.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const n = payments.length + 1;
    const padded = String(n).padStart(5, "0");
    setPayments((prev) => [
      {
        id: `PAY-${padded}`,
        booking: `BKG-${String(payments.length + 10).padStart(5, "0")}`,
        project: form.project,
        unit: form.unit,
        client: form.client,
        type: form.type.toLowerCase(),
        mode: form.mode.toLowerCase(),
        receipt: `PAY-${padded}`,
        date: form.date
          ? new Date(form.date).toLocaleDateString("en-GB").replace(/\//g, "/")
          : new Date().toLocaleDateString("en-GB"),
        amount: form.amount,
      },
      ...prev,
    ]);
    setLoading(false);
    setForm(EMPTY);
    setErrors({});
    setView("table");
    showToast("Payment recorded successfully!");
  }

  return (
    <div className="p-2 md:p-0">
      {view === "table" ? (
        <DataTable
          title="Payments"
          subtitle="Record and manage client payments"
          columns={COLUMNS}
          data={payments}
          searchKeys={[
            "booking",
            "project",
            "unit",
            "client",
            "type",
            "mode",
            "receipt",
            "date",
          ]}
          addLabel="Add Payment"
          addIcon={<Plus className="w-4 h-4" strokeWidth={2.5} />}
          onAddClick={() => {
            setForm(EMPTY);
            setErrors({});
            setView("create");
          }}
          rowsPerPage={5}
          emptyMessage="No payments recorded yet."
        />
      ) : (
        <FormPage
          title="Add Payment"
          subtitle="Record client payment against a flat"
          onBack={() => setView("table")}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <FormGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <FormField label="Project" required error={errors.project}>
                <FormSelect
                  value={form.project}
                  onChange={(e) => setProject(e.target.value)}
                  error={errors.project}
                >
                  <option value="">Select project</option>
                  {PROJECTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Flat/Unit" required error={errors.unit}>
                <FormSelect
                  value={form.unit}
                  onChange={(e) => f("unit", e.target.value)}
                  error={errors.unit}
                  disabled={!form.project}
                >
                  <option value="">Select flat/unit</option>
                  {(UNITS[form.project] || []).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Client" required error={errors.client}>
                <FormSelect
                  value={form.client}
                  onChange={(e) => f("client", e.target.value)}
                  error={errors.client}
                >
                  <option value="">Select client</option>
                  {CLIENTS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Payment Type" required>
                <FormSelect
                  value={form.type}
                  onChange={(e) => f("type", e.target.value)}
                >
                  <option value="Regular">Regular</option>
                  <option value="Advance">Advance</option>
                  <option value="Token">Token</option>
                  <option value="Final">Final</option>
                </FormSelect>
              </FormField>

              <FormField label="Payment Mode" required error={errors.mode}>
                <FormSelect
                  value={form.mode}
                  onChange={(e) => f("mode", e.target.value)}
                  error={errors.mode}
                >
                  <option value="">Select mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online">Online</option>
                </FormSelect>
              </FormField>

              <FormField label="Amount" required error={errors.amount}>
                <FormInput
                  type="number"
                  placeholder="e.g. 500000"
                  value={form.amount}
                  onChange={(e) => f("amount", e.target.value)}
                  error={errors.amount}
                  min="0"
                />
              </FormField>

              <FormField
                label={
                  <>
                    Payment Date{" "}
                    <span className="text-slate-400 font-normal text-xs">
                      (Optional)
                    </span>
                  </>
                }
              >
                <FormInput
                  type="date"
                  value={form.date}
                  onChange={(e) => f("date", e.target.value)}
                />
              </FormField>
            </FormGrid>

            <FormActions className="flex-col-reverse sm:flex-row gap-3">
              <FormCancelButton
                onClick={() => setView("table")}
                className="w-full sm:w-auto"
              />
              <FormSubmitButton
                loading={loading && "Saving..."}
                className="w-full sm:w-auto sm:px-16"
              >
                Save Payment
              </FormSubmitButton>
            </FormActions>
          </form>
        </FormPage>
      )}

      {toast && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-6 md:right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-4 py-3 animate-slide-up max-w-full md:max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-emerald-500" strokeWidth={3} />
          </div>
          <p className="text-sm font-medium text-slate-700 flex-1">{toast}</p>
          <button
            onClick={() => setToast("")}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

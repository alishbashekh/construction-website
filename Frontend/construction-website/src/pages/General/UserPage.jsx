import { useState } from "react";
import DataTable from "../../components/common/DataTable";
import FormPage, {
  FormGrid,
  FormField,
  FormInput,
  FormSelect,
  FormPasswordInput,
  FormActions,
  FormSubmitButton,
  FormCancelButton,
} from "../../components/common/FormPage";
import { UserPlus } from "lucide-react";

const ROLES = ["System Admin", "Booking Officer", "Accounts Officer"];
const STATUSES = ["Active", "Disabled"];

const UsersData = [
  {
    id: "USR-00006",
    name: "Muhammad Awais",
    email: "mawais1986@gmail.com",
    phone: "03237643876",
    role: "Booking Officer",
    status: "Active",
  },
  {
    id: "USR-00005",
    name: "Huzaifa Arain",
    email: "huzaifaarain11224@gmail.com",
    phone: "+923160306237",
    role: "Booking Officer",
    status: "Active",
  },
  {
    id: "USR-00004",
    name: "Ali Raza",
    email: "aliraza99@gmail.com",
    phone: "03001234567",
    role: "Accounts Officer",
    status: "Disabled",
  },
  {
    id: "USR-00003",
    name: "Yazdan Shaikh",
    email: "yazdanshaikh11@gmail.com",
    phone: "03131079353",
    role: "Accounts Officer",
    status: "Active",
  },
  {
    id: "USR-00002",
    name: "Sameer Shaikh",
    email: "alisameer52718@gmail.com",
    phone: "03160306237",
    role: "System Admin",
    status: "Active",
  },
  {
    id: "USR-00001",
    name: "Admin User",
    email: "admin@ottoman.com",
    phone: "02199887766",
    role: "System Admin",
    status: "Active",
  },
];

function StatusBadge({ value }) {
  return value === "Active" ? (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      Disabled
    </span>
  );
}

const COLUMNS = [
  { key: "id", label: "User ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "phone", label: "Phone", sortable: false },
  { key: "role", label: "Role", sortable: true },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (v) => <StatusBadge value={v} />,
  },
];

const FILTERS = [
  {
    key: "role",
    options: [
      { value: "", label: "All roles" },
      { value: "System Admin", label: "System Admin" },
      { value: "Booking Officer", label: "Booking Officer" },
      { value: "Accounts Officer", label: "Accounts Officer" },
    ],
  },
  {
    key: "status",
    options: [
      { value: "", label: "All statuses" },
      { value: "Active", label: "Active" },
      { value: "Disabled", label: "Disabled" },
    ],
  },
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  role: "",
  password: "",
  confirm: "",
};

/* ══════════════════════════════════════ */
export default function UsersPage() {
  const [users, setUsers] = useState(UsersData);
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
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.role) e.role = "Please select a role.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Min 6 characters.";
    if (!form.confirm) e.confirm = "Please confirm password.";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords don't match.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const n = users.length + 1;
    setUsers((prev) => [
      {
        id: `USR-${String(n).padStart(5, "0")}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        status: "Active",
      },
      ...prev,
    ]);
    setLoading(false);
    setForm(EMPTY);
    setErrors({});
    setView("table");
    showToast(`User "${form.name.trim()}" created successfully!`);
  }

  return (
    <div>
      {view === "table" ? (
        <DataTable
          title="Users"
          subtitle="Manage system users and their roles"
          columns={COLUMNS}
          data={users}
          filters={FILTERS}
          searchKeys={["id", "name", "email", "phone", "role", "status"]}
          addLabel="Add User"
          addIcon={<UserPlus className="w-4 h-4" strokeWidth={2.5} />}
          onAddClick={() => {
            setForm(EMPTY);
            setErrors({});
            setView("create");
          }}
          rowsPerPage={5}
          emptyMessage="No users found."
        />
      ) : (
        <FormPage
          title="Create User"
          subtitle="Add a new system user and assign a role."
          onBack={() => setView("table")}
        >
          <form onSubmit={handleSubmit} noValidate>
            <FormGrid>
              <FormField label="Full Name" required error={errors.name}>
                <FormInput
                  placeholder="e.g. Ahmed Khan"
                  value={form.name}
                  onChange={(e) => field("name", e.target.value)}
                  error={errors.name}
                  autoFocus
                />
              </FormField>

              <FormField label="Email Address" required error={errors.email}>
                <FormInput
                  type="email"
                  placeholder="e.g. ahmed@email.com"
                  value={form.email}
                  onChange={(e) => field("email", e.target.value)}
                  error={errors.email}
                />
              </FormField>

              <FormField label="Phone Number" required error={errors.phone}>
                <FormInput
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={form.phone}
                  onChange={(e) => field("phone", e.target.value)}
                  error={errors.phone}
                />
              </FormField>

              <FormField label="Role" required error={errors.role}>
                <FormSelect
                  value={form.role}
                  onChange={(e) => field("role", e.target.value)}
                  error={errors.role}
                >
                  <option value="">Select role</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Password" required error={errors.password}>
                <FormPasswordInput
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => field("password", e.target.value)}
                  error={errors.password}
                  autoComplete="new-password"
                />
              </FormField>

              <FormField
                label="Confirm Password"
                required
                error={errors.confirm}
              >
                <FormPasswordInput
                  placeholder="Confirm password"
                  value={form.confirm}
                  onChange={(e) => field("confirm", e.target.value)}
                  error={errors.confirm}
                  autoComplete="new-password"
                />
              </FormField>
            </FormGrid>

            <FormActions>
              <FormCancelButton onClick={() => setView("table")} />
              <FormSubmitButton loading={loading && "Creating..."}>
                Create User
              </FormSubmitButton>
            </FormActions>
          </form>
        </FormPage>
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-5 py-3.5 animate-slide-up max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-emerald-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-700 flex-1">{toast}</p>
          <button
            onClick={() => setToast("")}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

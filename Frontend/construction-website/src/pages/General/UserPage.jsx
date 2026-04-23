import { useState, useEffect, useCallback } from "react";
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
import { Check, UserPlus, X, Loader2, AlertCircle } from "lucide-react";
import { authAPI } from "../../utils/apiService";

const ROLE_LABELS = {
  system_admin:     "System Admin",
  booking_officer:  "Booking Officer",
  accounts_officer: "Accounts Officer",
};

const ROLE_OPTIONS = [
  { value: "system_admin",     label: "System Admin" },
  { value: "booking_officer",  label: "Booking Officer" },
  { value: "accounts_officer", label: "Accounts Officer" },
];

function StatusBadge({ value }) {
  return value === true || value === "Active" ? (
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
  { key: "userId",    label: "User ID",  sortable: true },
  { key: "fullName",  label: "Name",     sortable: true },
  { key: "email",     label: "Email",    sortable: true },
  { key: "phoneNumber", label: "Phone",  sortable: false },
  {
    key: "role",
    label: "Role",
    sortable: true,
    render: (v) => ROLE_LABELS[v] || v,
  },
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
      { value: "",                label: "All roles" },
      { value: "system_admin",    label: "System Admin" },
      { value: "booking_officer", label: "Booking Officer" },
      { value: "accounts_officer",label: "Accounts Officer" },
    ],
  },
  {
    key: "status",
    options: [
      { value: "",      label: "All statuses" },
      { value: "true",  label: "Active" },
      { value: "false", label: "Disabled" },
    ],
  },
];

const EMPTY = { fullName: "", email: "", phoneNumber: "", role: "", password: "", confirm: "" };

export default function UsersPage() {
  const [users,   setUsers]   = useState([]);
  const [view,    setView]    = useState("table");
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching,setFetching]= useState(true);
  const [fetchErr,setFetchErr]= useState("");
  const [toast,   setToast]   = useState("");

  // ── Fetch users from backend ──
  const loadUsers = useCallback(async () => {
    setFetching(true);
    setFetchErr("");
    try {
      const res = await authAPI.getUsers(1, 100);
      setUsers(res.data.data || []);
    } catch (err) {
      setFetchErr(err.response?.data?.message || "Failed to load users.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

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
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.role) e.role = "Please select a role.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Min 6 characters.";
    if (!form.confirm) e.confirm = "Please confirm password.";
    else if (form.confirm !== form.password) e.confirm = "Passwords don't match.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await authAPI.createUser({
        fullName:    form.fullName.trim(),
        email:       form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        role:        form.role,
        password:    form.password,
      });
      await loadUsers();
      setForm(EMPTY);
      setErrors({});
      setView("table");
      showToast(`User "${form.fullName.trim()}" created successfully!`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create user.";
      setErrors((e) => ({ ...e, api: msg }));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(row) {
    if (!window.confirm(`Delete user "${row.fullName}"?`)) return;
    try {
      await authAPI.deleteUser(row._id);
      await loadUsers();
      showToast(`User "${row.fullName}" deleted.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.");
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={28} />
        <span className="ml-3 text-slate-500">Loading users...</span>
      </div>
    );
  }

  if (fetchErr) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-2">
        <AlertCircle size={18} /> {fetchErr}
        <button onClick={loadUsers} className="ml-4 underline text-sm">Retry</button>
      </div>
    );
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
          searchKeys={["userId", "fullName", "email", "phoneNumber", "role"]}
          addLabel="Add User"
          addIcon={<UserPlus className="w-4 h-4" strokeWidth={2.5} />}
          onAddClick={() => { setForm(EMPTY); setErrors({}); setView("create"); }}
          rowsPerPage={10}
          emptyMessage="No users found."
        />
      ) : (
        <FormPage
          title="Create User"
          subtitle="Add a new system user and assign a role."
          onBack={() => setView("table")}
        >
          <form onSubmit={handleSubmit} noValidate>
            {errors.api && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {errors.api}
              </div>
            )}
            <FormGrid>
              <FormField label="Full Name" required error={errors.fullName}>
                <FormInput
                  placeholder="e.g. Ahmed Khan"
                  value={form.fullName}
                  onChange={(e) => field("fullName", e.target.value)}
                  error={errors.fullName}
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

              <FormField label="Phone Number" error={errors.phoneNumber}>
                <FormInput
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={form.phoneNumber}
                  onChange={(e) => field("phoneNumber", e.target.value)}
                  error={errors.phoneNumber}
                />
              </FormField>

              <FormField label="Role" required error={errors.role}>
                <FormSelect
                  value={form.role}
                  onChange={(e) => field("role", e.target.value)}
                  error={errors.role}
                >
                  <option value="">Select role</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
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

              <FormField label="Confirm Password" required error={errors.confirm}>
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

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-xl px-5 py-3.5 animate-slide-up max-w-sm">
          <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
          </div>
          <p className="text-sm text-slate-700 flex-1">{toast}</p>
          <button onClick={() => setToast("")} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

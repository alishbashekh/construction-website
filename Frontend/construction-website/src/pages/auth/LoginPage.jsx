import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  OttomanLogo,
  InputField,
  PasswordInput,
  PrimaryButton,
  Alert,
  AuthCard,
} from "../../components/UI";
import { ForgotPasswordModal } from "../../components/Modal/ForgetPasswordModal";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
    if (apiError) setApiError("");
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setApiError("");

    const result = await login(form.email.trim(), form.password);
    setLoading(false);

    if (!result.success) return setApiError(result.error);
    navigate("/dashboard", { replace: true });
  }

  return (
    <>
      <div className="auth-bg min-h-screen flex items-center justify-center p-4 bg-[var(--accent)]">
        <div className="relative z-10 w-full max-w-md">
          <AuthCard>
            <div className="flex justify-center mb-6">
              <OttomanLogo size="md" />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Sign in to Ottoman Group
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Manage your projects and clients from one place.
              </p>
            </div>

            {apiError && (
              <div className="mb-4">
                <Alert type="error" message={apiError} />
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <InputField
                label="Email"
                id="email"
                type="email"
                placeholder="admin@ottoman.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                error={errors.email}
                required
                autoComplete="email"
                autoFocus
              />

              <div className="flex flex-col gap-1.5">
                <PasswordInput
                  label="Password"
                  id="password"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <PrimaryButton
                loading={loading && "Signing in..."}
                className="mt-1"
              >
                Sign in
              </PrimaryButton>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Create account
              </Link>
            </p>
          </AuthCard>

          <p className="text-center text-white/50 text-xs mt-4">
            New here?{" "}
            <Link
              to="/register"
              className="text-white/70 underline underline-offset-2"
            >
              Create a free account
            </Link>{" "}
            to get started.
          </p>
        </div>
      </div>
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </>
  );
};
export default LoginPage;

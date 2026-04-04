import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  OttomanLogo,
  InputField,
  PasswordInput,
  PrimaryButton,
  Alert,
  AuthCard,
} from "../../components/common/UI";
import { PasswordStrengthMeter } from "../../components/common/PasswordStrengthMeter";
import {
  getPasswordStrength,
  isPasswordValid,
} from "../../utils/passwordUtils";
import { Check, X, AlertCircle } from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const strength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  );
  const passwordStrong = strength.score >= 3; // must be "Strong" or "Super Strong"

  function setField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
    if (apiError) setApiError("");
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    else if (form.name.trim().length < 2)
      errs.name = "Name must be at least 2 characters.";

    if (!form.email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email address.";

    if (!form.password) errs.password = "Password is required.";
    else if (!isPasswordValid(form.password))
      errs.password = "Password does not meet all requirements.";
    else if (!passwordStrong)
      errs.password = 'Password must be at least "Strong" to continue.';

    if (!form.confirmPassword)
      errs.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password)
      errs.confirmPassword = "Passwords do not match.";

    if (!agreed) errs.agreed = "You must agree to the terms to continue.";

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setApiError("");

    const result = await register(
      form.name.trim(),
      form.email.trim(),
      form.password,
    );
    setLoading(false);

    if (!result.success) return setApiError(result.error);
    // Auto-login after registration → redirect dashboard
    navigate("/dashboard", { replace: true });
  }

  const canSubmit = passwordStrong && !loading;

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4 py-10">
      <div className="relative z-10 w-full max-w-md">
        <AuthCard>
          <div className="flex justify-center mb-5">
            <OttomanLogo size="md" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-slate-500 mt-1.5">
              Join Ottoman Group and manage your projects.
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
              label="Full Name"
              id="name"
              type="text"
              placeholder="John Smith"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              error={errors.name}
              required
              autoComplete="name"
              autoFocus
            />

            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="flex flex-col gap-2">
              <PasswordInput
                label="Password"
                id="password"
                placeholder="••••••••••"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                error={errors.password}
                required
                autoComplete="new-password"
              />
              <PasswordStrengthMeter password={form.password} />
            </div>

            <div className="flex flex-col gap-1.5">
              <PasswordInput
                label="Confirm Password"
                id="confirmPassword"
                placeholder="••••••••••"
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
              {form.confirmPassword && form.password && (
                <p
                  className={`text-xs flex items-center gap-1 ${
                    form.confirmPassword === form.password
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {form.confirmPassword === form.password ? (
                    <>
                      <Check className="w-4 h-4" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Passwords don't match
                    </>
                  )}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      if (errors.agreed)
                        setErrors((e2) => ({ ...e2, agreed: "" }));
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all ${
                      agreed
                        ? "bg-blue-600 border-blue-600"
                        : "border-slate-300 group-hover:border-blue-400"
                    }`}
                  >
                    {agreed && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{" "}
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-red-500 text-xs ml-7 animate-fade-in">
                  {errors.agreed}
                </p>
              )}
            </div>

            <PrimaryButton
              loading={loading && "Creating account..."}
              disabled={!canSubmit}
              className="mt-1"
              title={
                !passwordStrong
                  ? "Password must be at least Strong to continue"
                  : undefined
              }
            >
              Create account
            </PrimaryButton>

            {form.password && !passwordStrong && (
              <p className="text-center text-xs text-amber-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Password must reach "Strong" level to register
              </p>
            )}
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </AuthCard>
      </div>
    </div>
  );
};
export default RegisterPage;

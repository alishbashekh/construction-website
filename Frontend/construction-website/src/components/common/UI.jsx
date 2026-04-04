import { useState, forwardRef } from "react";
import Logo from "../../assets/images/logo.png";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeClosed,
  Info,
  Loader2,
} from "lucide-react";
export function OttomanLogo({ size = "md" }) {
  const sizes = {
    sm: "h-10",
    md: "h-14",
    lg: "h-20",
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <img src={Logo} className="h-25 w-auto" />
    </div>
  );
}

/* ─── Input Field ─── */
export const InputField = forwardRef(function InputField(
  { label, id, error, required, className = "", ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500 text-xs">*</span>}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl border text-slate-800 text-sm placeholder-slate-400
          bg-blue-50 border-blue-100 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
          ${error ? "border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-400" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

export function PasswordInput({
  label,
  id,
  error,
  required,
  className = "",
  ...props
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500 text-xs">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`
            w-full px-4 py-3 pr-12 rounded-xl border text-slate-800 text-sm placeholder-slate-400
            bg-blue-50 border-blue-100 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
            ${error ? "border-red-400 bg-red-50 focus:ring-red-500/20 focus:border-red-400" : ""}
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
          tabIndex={-1}
        >
          {show ? <EyeClosed /> : <Eye />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  disabled,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        relative w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm
        overflow-hidden transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
        ${
          !disabled && !loading
            ? "bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 active:translate-y-0"
            : "bg-gradient-to-r from-blue-700 to-blue-600"
        }
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          {loading}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function Alert({ type = "error", message }) {
  if (!message) return null;
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
  };
  const icons = {
    error: <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />,
    success: <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 shrink-0 mt-0.5" />,
  };
  return (
    <div
      className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-sm animate-fade-in ${styles[type]}`}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

export function AuthCard({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-8 sm:p-10 w-full max-w-md animate-slide-up">
      {children}
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-slate-200" />
      {label && (
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      )}
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

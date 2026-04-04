import {
  ArrowLeft,
  ChevronDown,
  Eye,
  EyeOff,
  Info,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function FormPage({ title, subtitle, onBack, children }) {
  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-slate-800 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        {children}
      </div>
    </div>
  );
}

export function FormGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {children}
    </div>
  );
}

export function FormField({
  label,
  required,
  error,
  children,
  className = "",
  fullWidth = false,
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 ${fullWidth ? "md:col-span-2" : ""} ${className}`}
    >
      {label && (
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500 text-[13px]">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function FormInput({ error, className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-[11px] rounded-lg border text-sm text-slate-800 placeholder-slate-400
        border-slate-200 bg-white transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
        ${error ? "border-red-400 bg-red-50" : ""}
        ${className}`}
      {...props}
    />
  );
}

export function FormSelect({ error, className = "", children, ...props }) {
  return (
    <div className="relative">
      <select
        className={`w-full appearance-none px-4 py-[11px] pr-10 rounded-lg border text-sm text-slate-800
          border-slate-200 bg-white transition-all duration-150 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          ${error ? "border-red-400 bg-red-50" : ""}
          ${className}`}
        {...props}
      >
        {children}
      </select>

      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
        strokeWidth={2}
      />
    </div>
  );
}

export function FormPasswordInput({ error, className = "", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={`w-full px-4 py-[11px] pr-12 rounded-lg border text-sm text-slate-800 placeholder-slate-400
          border-slate-200 bg-white transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          ${error ? "border-red-400 bg-red-50" : ""}
          ${className}`}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
      >
        {show ? (
          <EyeOff className="w-5 h-5" strokeWidth={1.8} />
        ) : (
          <Eye className="w-5 h-5" strokeWidth={1.8} />
        )}
      </button>
    </div>
  );
}

export function FormActions({ children }) {
  return <div className="flex justify-end gap-3 mt-6">{children}</div>;
}

export function FormSubmitButton({
  loading,
  children,
  disabled,
  className = "",
  ...props
}) {
  return (
    <button
      type="submit"
      disabled={disabled || !!loading}
      className={`px-8 py-3 rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-semibold
        shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2
        ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {loading}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormCancelButton({
  children = "Cancel",
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-3 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium
        hover:bg-slate-50 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

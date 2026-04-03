import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { InputField, PrimaryButton, Alert } from "../UI";

export function ForgotPasswordModal({ onClose }) {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Please enter your email address.");
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Please enter a valid email address.");

    setLoading(true);
    const result = await sendPasswordReset(email);
    setLoading(false);

    if (!result.success) return setError(result.error);
    setSuccess(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-slide-up">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Reset password</h2>
            <p className="text-sm text-slate-500 mt-1">
              {success
                ? "Check your inbox for next steps."
                : "Enter your email and we'll send a reset link."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mt-1 -mr-1"
          >
            <svg
              className="w-5 h-5"
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

        {success ? (
          <div className="flex flex-col items-center gap-5 py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-800 mb-1">Email sent!</p>
              <p className="text-sm text-slate-500">
                A reset link was sent to{" "}
                <strong className="text-slate-700">{email}</strong>. Check your
                spam folder if it doesn't arrive.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <Alert type="error" message={error} />

            <InputField
              label="Email address"
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />

            <PrimaryButton loading={loading && "Sending reset link..."}>
              Send reset link
            </PrimaryButton>

            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors text-center py-1"
            >
              Back to sign in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

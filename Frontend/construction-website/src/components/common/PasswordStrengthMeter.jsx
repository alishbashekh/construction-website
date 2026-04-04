import { useMemo } from "react";
import {
  validatePassword,
  getPasswordStrength,
  PASSWORD_RULES,
} from "../../utils/passwordUtils";

/**
 * PasswordStrengthMeter — shows 4 strength bars + rule checklist.
 * Used in Register.jsx below the password field.
 */
export function PasswordStrengthMeter({ password }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const rules = useMemo(() => validatePassword(password), [password]);

  if (!password) return null;

  const bars = [1, 2, 3, 4];

  const barColors = {
    0: "bg-slate-200",
    1: "bg-red-500",
    2: "bg-orange-400",
    3: "bg-yellow-400",
    4: "bg-green-500",
  };

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      {/* Strength bars */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Password strength
          </span>
          {strength.score > 0 && (
            <span
              className="text-xs font-semibold"
              style={{ color: strength.color }}
            >
              {strength.label}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          {bars.map((bar) => (
            <div
              key={bar}
              className={`strength-bar flex-1 rounded-full ${
                bar <= strength.score
                  ? barColors[strength.score]
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Rule checklist */}
      <div className="grid grid-cols-2 gap-1">
        {PASSWORD_RULES.map((rule) => (
          <div key={rule.key} className="flex items-center gap-1.5">
            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                rules[rule.key] ? "bg-green-500" : "bg-slate-200"
              }`}
            >
              {rules[rule.key] && (
                <svg
                  className="w-2 h-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                rules[rule.key] ? "text-green-600" : "text-slate-400"
              }`}
            >
              {rule.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function validatePassword(password) {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 15,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  const rules = validatePassword(password);
  const passed = Object.values(rules).filter(Boolean).length;

  if (passed <= 2) return { score: 1, label: "Weak", color: "#ef4444" };
  if (passed === 3) return { score: 2, label: "Medium", color: "#f97316" };
  if (passed === 4 || passed === 5)
    return { score: 3, label: "Strong", color: "#eab308" };
  return { score: 4, label: "Super Strong", color: "#22c55e" };
}

export function isPasswordValid(password) {
  const rules = validatePassword(password);
  return Object.values(rules).every(Boolean);
}

export const PASSWORD_RULES = [
  { key: "minLength", label: "At least 8 characters" },
  { key: "maxLength", label: "Maximum 15 characters" },
  { key: "hasUppercase", label: "One uppercase letter (A–Z)" },
  { key: "hasLowercase", label: "One lowercase letter (a–z)" },
  { key: "hasNumber", label: "One number (0–9)" },
  { key: "hasSpecial", label: "One special character (!@#$...)" },
];

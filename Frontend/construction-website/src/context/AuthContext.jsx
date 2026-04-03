import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "ottoman_auth_user";
const USERS_KEY = "ottoman_auth_users";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const saveUser = useCallback((userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email, password) => {
      // Simulate async network delay
      await new Promise((r) => setTimeout(r, 800));

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (!found)
        return { success: false, error: "No account found with this email." };
      if (found.password !== password)
        return { success: false, error: "Incorrect password." };

      saveUser({ email: found.email, name: found.name, avatar: found.avatar });
      return { success: true };
    },
    [saveUser],
  );

  const register = useCallback(
    async (name, email, password) => {
      await new Promise((r) => setTimeout(r, 800));

      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const exists = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (exists)
        return {
          success: false,
          error: "An account with this email already exists.",
        };

      // Generate a simple avatar initial
      const avatar = name.trim().charAt(0).toUpperCase();
      const newUser = { name, email, password, avatar };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

      saveUser({ email, name, avatar });
      return { success: true };
    },
    [saveUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    await new Promise((r) => setTimeout(r, 1000));
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!found)
      return {
        success: false,
        error: "No account found with this email address.",
      };
    // In a real app, send email here
    return { success: true };
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    sendPasswordReset,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

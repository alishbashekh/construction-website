import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../utils/apiService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ottoman_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      const { user, token } = res.data.data;
      localStorage.setItem("ottoman_token", token);
      localStorage.setItem("ottoman_user", JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ottoman_token");
    localStorage.removeItem("ottoman_user");
    setUser(null);
  }, []);

  const sendPasswordReset = useCallback(async (email) => {
    try {
      await authAPI.forgotPassword(email);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Email not found",
      };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        sendPasswordReset,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

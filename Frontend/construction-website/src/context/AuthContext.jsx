import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../utils/apiService";

const AuthContext = createContext(null);
const STORAGE_KEY = "ottoman_token";
const USER_KEY = "ottoman_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
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
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  }, []);

  const register = useCallback(
    async (fullName, email, password, role = "booking_officer") => {
      try {
        const res = await authAPI.createUser({
          fullName,
          email,
          password,
          role,
        });
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || "Register failed",
        };
      }
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
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
        register,
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

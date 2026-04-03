import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//  if user is authenticated then go to pages other wise redirect to login
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// only go to dashboard if use is authenticated 
export function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

// Spinner 
function PageLoader() {
  return (
    <div className="auth-bg min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white/70 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

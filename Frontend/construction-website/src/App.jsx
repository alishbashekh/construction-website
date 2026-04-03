import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/General/Dashboard";
import UserPage from "./pages/General/UserPage";
import LogsPage from "./pages/General/LogsPage";
import BookingsPage from "./pages/apartmentBookings/BookingsPage";
import ClientPayments from "./pages/apartmentBookings/ClientPayments";
import ClientsPage from "./pages/apartmentBookings/ClientsPage";
import FlatsPage from "./pages/apartmentBookings/FlatsPage";
import ProjectsPage from "./pages/apartmentBookings/ProjectsPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserPage />} />
            <Route path="logs" element={<LogsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="flats" element={<FlatsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="payments" element={<ClientPayments />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
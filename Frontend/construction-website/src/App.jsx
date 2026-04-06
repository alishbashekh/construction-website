import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/common/RouteGuards";
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
import SalesSummary from "./pages/reports/SalesSummary";
import FlatsAvailability from "./pages/reports/FlatsAvailability";
import ClientDues from "./pages/reports/ClientDues";
import PaymentCollection from "./pages/reports/PaymentCollection";
import ClientLedger from "./pages/reports/ClientLedger";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
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
            <Route path="/reports/sales-summary" element={<SalesSummary />} />
            <Route
              path="/reports/flats-availability"
              element={<FlatsAvailability />}
            />
            <Route path="/reports/client-dues" element={<ClientDues />} />
            <Route
              path="/reports/payment-collection"
              element={<PaymentCollection />}
            />
            <Route path="/reports/client-ledger" element={<ClientLedger />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

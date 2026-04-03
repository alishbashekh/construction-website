import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/General/Dashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import UserPage from "./pages/General/UserPage"
import LogsPage from "./pages/General/LogsPage"
import BookingsPage from "./pages/apartmentBookings/BookingsPage"
import ClientPayments from "./pages/apartmentBookings/ClientPayments"
import ClientsPage from "./pages/apartmentBookings/ClientsPage"
import FlatsPage from "./pages/apartmentBookings/FlatsPage"
import ProjectsPage from "./pages/apartmentBookings/ProjectsPage"


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
          
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* General */}
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="users" element={<UserPage/>} />
          <Route path="logs" element={<LogsPage/>} />

          {/* Apartment Bookings */}
          <Route path="projects" element={<ProjectsPage/>} />
          <Route path="flats" element={<FlatsPage/>} />
          <Route path="clients" element={<ClientsPage/>} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="payments" element={<ClientPayments/>} />


          </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
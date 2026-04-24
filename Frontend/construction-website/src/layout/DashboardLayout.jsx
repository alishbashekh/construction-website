import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"; // ← add this
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {  // ← remove { children }
   const [open, setOpen] = useState(false);
     const { logout, user } = useAuth(); 
     const navigate = useNavigate();  

   const handleLogout = () => {
      logout();
     navigate("/login", { replace: true }); 
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar onLogout={handleLogout} user={user} />
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white shadow-lg">
            <Sidebar onLogout={handleLogout} user={user} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1">
        <Header 
          toggleSidebar={() => setOpen(true)} 
          user={user}
        />

        <div className="p-6">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
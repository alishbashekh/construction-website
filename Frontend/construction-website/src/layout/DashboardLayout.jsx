import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // ← add this
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = () => {  // ← remove { children }
   const [open, setOpen] = useState(false);

   const handleLogout = () => {
    localStorage.removeItem("ottoman_token");
    localStorage.removeItem("ottoman_user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("ottoman_user"));

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
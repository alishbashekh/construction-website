import React, { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const user = {
    username: "Abdullah",
    email: "abdullah@gmail.com",
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-white shadow-lg">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      {/* Main */}
      <div className="flex-1">

        {/* Header */}
        <Header 
          toggleSidebar={() => setOpen(true)} 
          user={user}
        />

        <div className="p-6">{children}</div>

      </div>
    </div>
  );
};

export default DashboardLayout;
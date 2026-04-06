import React from "react";
import { User, MenuIcon, BellIcon } from "lucide-react";

const Header = ({ toggleSidebar, user }) => {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-md">
      
      <div className="flex items-center justify-between h-full px-6">
        
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <MenuIcon size={24} />
        </button>

        {/* Spacer */}
        <div className="hidden md:block"></div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          
          {/* Notification */}
          <button className="relative inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group">
            <BellIcon
              size={20}
              strokeWidth={2}
              className="group-hover:scale-110 transition-transform duration-200"
            />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200/60">
            
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer group">
              
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition">
                <User size={18} strokeWidth={2.5} />
              </div>

            </div>

            {/* User Info (UI only) */}
            <div className="flex flex-col leading-tight">
              <p className="text-sm font-semibold text-slate-900">
                {user?.username || "John Doe"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.email || "john@example.com"}
              </p>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
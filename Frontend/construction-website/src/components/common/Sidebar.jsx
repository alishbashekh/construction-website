import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const baseClass =
    "flex items-center px-3 py-2 rounded-xl transition cursor-pointer";

  const activeClass = "bg-blue-50 text-blue-600 font-medium";
  const inactiveClass =
    "text-slate-600 hover:bg-slate-100 hover:text-blue-600";

  return (
    <div className="w-64 min-h-full bg-blue-400 backdrop-blur-xl border-r border-slate-200/60 p-5">

      {/* Logo */}
      <h2 className="text-lg font-semibold text-blue-700 mb-8 tracking-tight">
        OTTOMAN CONSTRUCTION
      </h2>
       <hr className="mb-2 text-slate-400"/>
      {/* General */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          General
        </p>

        <ul className="space-y-1 text-sm">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass} space-y-1 text-sm font-bold`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass} space-y-1 text-sm font-bold`
            }
          >
            Users
          </NavLink>

          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass} space-y-1 text-sm font-bold`
            }
          >
            Logs
          </NavLink>

        </ul>
      </div>

      {/* Apartment Bookings */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Apartment Bookings
        </p>

        <ul className="space-y-1 text-sm font-bold">

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/flats"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Flats/Units
          </NavLink>

          <NavLink
            to="/clients"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Clients
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Bookings
          </NavLink>

          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            Client Payments
          </NavLink>

        </ul>
      </div>

    </div>
  );
};

export default Sidebar;
import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
const Sidebar = () => {
  const baseClass =
    "flex items-center px-3 py-2.5 rounded-xl transition cursor-pointer";

  const activeClass = "bg-[var(--accent)]  text-white font-bold";
  const inactiveClass = "text-slate-200 hover:bg-slate-100 hover:text-[var(--accent)]";

  return (
    <div className="w-64 min-h-full bg-[var(--color-primary)] backdrop-blur-xl border-r border-slate-200/60 p-5">
      {/* Logo */}

      <img src={Logo} className="w-36 h-23 mx-auto " />
      <hr className="mb-2 text-slate-400" />
      {/* General */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
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
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
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

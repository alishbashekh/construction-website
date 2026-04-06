import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import {
  LayoutDashboard,
  Users,
  FileText,
  Folder,
  Home,
  User,
  Calendar,
  CreditCard,
  BarChart2,
  ChevronDown,
  LogOut,
  AlertCircle
} from "lucide-react";
const REPORT_ROUTES = [
  "#/reports/sales-summary",
  "#/reports/flats-availability",
  "#/reports/client-dues",
  "#/reports/payment-collection",
  "#/reports/client-ledger",
];

const REPORT_LINKS = [
  { to: "#/reports/sales-summary", label: "Sales Summary" },
  { to: "#/reports/flats-availability", label: "Flats Availability" },
  { to: "#/reports/client-dues", label: "Client Dues" },
  { to: "#/reports/payment-collection", label: "Payment Collection" },
  { to: "#/reports/client-ledger", label: "Client Ledger" },
];

const base = "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer text-sm font-bold w-full";
const active = "bg-[#1a6fa8] text-white";
const inactive = "text-slate-200 hover:bg-white/10 hover:text-white";

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-80 mx-4 overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
        <div className="h-1 w-full bg-gradient-to-r from-[#0f3a5c] to-[#1a6fa8]" />
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-lg font-extrabold text-slate-800 mb-1">Confirm Logout</h2>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to log out? Any unsaved changes may be lost.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0f3a5c] hover:bg-[#1a6fa8] text-white text-sm font-bold transition-colors"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isReportActive = REPORT_ROUTES.some((r) => location.pathname.startsWith(r));
  const [reportsOpen, setReportsOpen] = useState(isReportActive);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    localStorage.clear();
    sessionStorage.clear();
    if (onLogout) onLogout();
    window.location.href = "#/login";
  };

  return (
    <div className="w-64 h-screen bg-[#0f3a5c] flex flex-col border-r border-white/10">
      <div className="px-5 pt-5 pb-2 flex justify-center">
        <img src={Logo} alt="Logo" className="w-36 h-auto mx-auto" />
      </div>
      <hr className="border-white/20 mb-4" />

      <nav className="flex-1 px-4 pb-4 overflow-y-auto flex flex-col gap-6 sidebar-scroll">
        {/* General */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            General
          </p>
          <ul className="space-y-0.5">
            <li>
              <NavLink to="#/dashboard" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="#/users" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <Users size={20} /> Users
              </NavLink>
            </li>
            <li>
              <NavLink to="#/logs" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <FileText size={20} /> Logs
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Apartment Bookings */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            Apartment Bookings
          </p>
          <ul className="space-y-0.5">
            <li>
              <NavLink to="#/projects" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <Folder size={20} /> Projects
              </NavLink>
            </li>
            <li>
              <NavLink to="#/flats" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <Home size={20} /> Flats / Units
              </NavLink>
            </li>
            <li>
              <NavLink to="#/clients" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <User size={20} /> Clients
              </NavLink>
            </li>
            <li>
              <NavLink to="#/bookings" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <Calendar size={20} /> Bookings
              </NavLink>
            </li>
            <li>
              <NavLink to="#/payments" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                <CreditCard size={20} /> Client Payments
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Reports */}
        <div>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => setReportsOpen(!reportsOpen)}
                className={`${base} ${isReportActive ? active : inactive} justify-between`}
              >
                <span className="flex items-center gap-3">
                  <BarChart2 size={20} /> Client Reports
                </span>
                <ChevronDown className={`transition-transform duration-200 ${reportsOpen ? "rotate-180" : ""}`} />
              </button>
              {reportsOpen && (
                <ul className="mt-0.5 ml-4 border-l border-white/15 pl-3 space-y-0.5">
                  {REPORT_LINKS.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                            isActive ? "bg-[#1a6fa8] text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-bold transition-all"
        >
          <LogOut size={20} /> Log out
        </button>
      </div>

      {showLogoutModal && (
        <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />
      )}
    </div>
  );
}
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

/* ── Icons ── */
const Icons = {
  dashboard: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logs: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  projects: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  flats: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  clients: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  bookings: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  payments: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  reports: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  chevron: (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  warning: (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
};

const REPORT_ROUTES = [
  "/reports/sales-summary",
  "/reports/flats-availability",
  "/reports/client-dues",
  "/reports/payment-collection",
  "/reports/client-ledger",
];

const REPORT_LINKS = [
  { to: "/reports/sales-summary", label: "Sales Summary" },
  { to: "/reports/flats-availability", label: "Flats Availability" },
  { to: "/reports/client-dues", label: "Client Dues" },
  { to: "/reports/payment-collection", label: "Payment Collection" },
  { to: "/reports/client-ledger", label: "Client Ledger" },
];

const base = "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer text-sm font-bold w-full";
const active = "bg-[#1a6fa8] text-white";
const inactive = "text-slate-200 hover:bg-white/10 hover:text-white";

/* ── Logout Confirmation Modal ── */
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-80 mx-4 overflow-hidden animate-[fadeInScale_0.2s_ease-out]">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#0f3a5c] to-[#1a6fa8]" />

        <div className="p-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-4">
            {Icons.warning}
          </div>

          <h2 className="text-lg font-extrabold text-slate-800 mb-1">
            Confirm Logout
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to log out? Any unsaved changes may be lost.
          </p>

          {/* Buttons */}
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

      {/* Keyframe animation via style tag */}
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

  
  window.location.href = "/login";
};

  return (
    <>
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      <div className="w-64 h-screen bg-[#0f3a5c] flex flex-col border-r border-white/10">
        {/* Logo */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex justify-center mb-4">
            <img src={Logo} alt="Logo" className="w-36 h-auto mx-auto" />
          </div>
          <hr className="border-white/20" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 pb-4 overflow-y-auto flex flex-col gap-6 sidebar-scroll">
          {/* ── GENERAL ── */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">General</p>
            <ul className="space-y-0.5">
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.dashboard} Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/users" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.users} Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/logs" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.logs} Logs
                </NavLink>
              </li>
            </ul>
          </div>

          {/* ── APARTMENT BOOKINGS ── */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Apartment Bookings</p>
            <ul className="space-y-0.5">
              <li>
                <NavLink to="/projects" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.projects} Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/flats" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.flats} Flats / Units
                </NavLink>
              </li>
              <li>
                <NavLink to="/clients" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.clients} Clients
                </NavLink>
              </li>
              <li>
                <NavLink to="/bookings" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.bookings} Bookings
                </NavLink>
              </li>
              <li>
                <NavLink to="/payments" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                  {Icons.payments} Client Payments
                </NavLink>
              </li>
            </ul>
          </div>

          {/* ── CLIENT REPORTS (accordion) ── */}
          <div>
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={() => setReportsOpen((o) => !o)}
                  className={`${base} ${isReportActive ? active : inactive} justify-between`}
                >
                  <span className="flex items-center gap-3">{Icons.reports} Client Reports</span>
                  <span className={`transition-transform duration-200 ${reportsOpen ? "rotate-180" : ""}`}>
                    {Icons.chevron}
                  </span>
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

        {/* ── Log out ── */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a6fa8] hover:bg-[#155d8f] text-white text-sm font-bold transition-all"
          >
            {Icons.logout}
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
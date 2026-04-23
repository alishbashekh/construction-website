import React, { useState, useEffect } from "react";
import {
  Building2,
  Home,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
} from "lucide-react";
import { dashboardAPI } from "../../utils/apiService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(amount) {
  if (!amount && amount !== 0) return "Rs. 0";
  if (amount >= 1_000_000_000) return `Rs. ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000)     return `Rs. ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)         return `Rs. ${(amount / 1_000).toFixed(0)}K`;
  return `Rs. ${amount.toLocaleString()}`;
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const STAT_ICONS = {
  "Total Projects": Building2,
  "Total Units":    Home,
  "Active Clients": Users,
  "Total Revenue":  DollarSign,
};
const STAT_COLORS = {
  "Total Projects": "bg-blue-500",
  "Total Units":    "bg-green-500",
  "Active Clients": "bg-purple-500",
  "Total Revenue":  "bg-yellow-500",
};

function ChangeIndicator({ change, changeType }) {
  if (changeType === "increase") return (
    <span className="text-green-600 text-xs flex items-center gap-0.5">
      <TrendingUp size={12} /> {change} this month
    </span>
  );
  if (changeType === "decrease") return (
    <span className="text-red-500 text-xs flex items-center gap-0.5">
      <TrendingDown size={12} /> {change} this month
    </span>
  );
  return (
    <span className="text-slate-400 text-xs flex items-center gap-0.5">
      <Minus size={12} /> {change} this month
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.get();
        setData(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-slate-500">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <AlertCircle className="inline mr-2" size={18} />
        {error}
      </div>
    );
  }

  const { kpiData = [], recentActivities = [], topClients = [], unitsStatusData = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Overview of your apartment booking system
        </p>
      </div>

      {/* KPI STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiData.map((item, i) => {
          const Icon  = STAT_ICONS[item.title]  || Building2;
          const color = STAT_COLORS[item.title] || "bg-slate-500";
          const displayValue =
            item.title === "Total Revenue"
              ? formatCurrency(item.value)
              : item.value;

          return (
            <div key={i} className="bg-white p-5 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h2 className="text-xl font-bold">{displayValue}</h2>
                  <ChangeIndicator change={item.change} changeType={item.changeType} />
                </div>
                <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${color}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Units Status */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Units Status</h3>
          <p className="text-sm text-slate-500 mb-4">Current inventory breakdown</p>
          <div className="space-y-3">
            {unitsStatusData.map((item, i) => {
              const total = unitsStatusData.reduce((s, x) => s + x.value, 0) || 1;
              const pct   = Math.round((item.value / total) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.name}</span>
                    <span className="font-medium">{item.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Revenue & Bookings Trend</h3>
          <p className="text-sm text-slate-500 mb-4">Last 6 months performance</p>
          <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-sm">
            Chart component can be added here using recharts/chart.js
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RECENT ACTIVITIES */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Recent Activities</h3>
          <p className="text-sm text-slate-500 mb-4">Latest updates</p>

          {recentActivities.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {recentActivities.map((item, i) => (
                <div key={i} className="flex items-start gap-3 border-b pb-3">
                  {item.category === "payment" || item.category === "refund" ? (
                    <DollarSign className="text-blue-500 shrink-0 mt-0.5" size={18} />
                  ) : item.category === "booking" ? (
                    <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={18} />
                  ) : (
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  )}
                  <div>
                    <p className="text-sm text-slate-700">{item.description}</p>
                    <p className="text-xs text-slate-400">
                      {timeAgo(item.time)} • {item.performedBy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TOP CLIENTS */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Top Clients</h3>
          <p className="text-sm text-slate-500 mb-4">By total investment</p>

          {topClients.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No client data yet.</p>
          ) : (
            <div className="space-y-4">
              {topClients.map((c, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-600">
                      {c.name?.[0] || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.units} unit(s) purchased</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCurrency(c.totalSpent)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React from "react";
import StatCard from "../../components/common/StatCard";
import { Building2, FileText, TrendingUp, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Projects",
      value: "12",
      icon: Building2,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      label: "Properties",
      value: "48",
      icon: FileText,
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-500",
    },
    {
      label: "Growth",
      value: "+18%",
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h3>
        </div>

        {/* Empty State */}
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-slate-100 mb-3">
            <Clock className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600">
            No recent activity yet
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Activity will appear here once you start working
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
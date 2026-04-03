import React from "react";

const StatCard = ({ label, value, icon: Icon, gradient }) => {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl shadow p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase">
          {label}
        </span>
        <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">{value}</h2>
    </div>
  );
};

export default StatCard;
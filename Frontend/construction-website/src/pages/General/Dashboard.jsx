import React from "react";
import {
  Building2,
  Home,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "2",
      sub: "0 this month",
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: "Total Units",
      value: "13",
      sub: "0 this month",
      icon: Home,
      color: "bg-green-500",
    },
    {
      title: "Active Clients",
      value: "9",
      sub: "0 this month",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Total Revenue",
      value: "Rs. 90M",
      sub: "-100% this month",
      icon: DollarSign,
      color: "bg-yellow-500",
    },
  ];

  const activities = [
    {
      text: "Recorded payment of 50000 for booking BKG-00012 (Sameer Shaikh)",
      type: "money",
    },
    {
      text: 'Booked flat 108 for client "Sameer Shaikh"',
      type: "success",
    },
    {
      text: 'Created flat 108 in project "Ottoman Heights"',
      type: "alert",
    },
  ];

  const clients = [
    { name: "Danish", units: 2, amount: "Rs 42,550,000.00" },
    { name: "Nadeem Baig", units: 1, amount: "Rs 27,500,000.00" },
    { name: "Syed Faraz Ali", units: 1, amount: "Rs 5,000,000.00" },
    { name: "Nadeem Shaikh", units: 1, amount: "Rs 5,000,000.00" },
  ];

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of your apartment booking system
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>
                <h2 className="text-xl font-bold">{item.value}</h2>
                <p className="text-xs text-slate-400">{item.sub}</p>
              </div>

              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white ${item.color}`}
              >
                <item.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LINE CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">
            Revenue & Bookings Trend
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Last 6 months performance
          </p>

          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
            Chart here
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Units Status</h3>
          <p className="text-sm text-slate-500 mb-4">
            Current inventory
          </p>

          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
            Pie chart here
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT ACTIVITIES */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Recent Activities</h3>
          <p className="text-sm text-slate-500 mb-4">Latest updates</p>

          <div className="space-y-4">
            {activities.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b pb-3"
              >
                {item.type === "money" && (
                  <DollarSign className="text-blue-500" size={18} />
                )}
                {item.type === "success" && (
                  <CheckCircle className="text-green-500" size={18} />
                )}
                {item.type === "alert" && (
                  <AlertCircle className="text-red-500" size={18} />
                )}

                <div>
                  <p className="text-sm text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400">
                    3 days ago • System Admin
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP CLIENTS */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-semibold text-lg">Top Clients</h3>
          <p className="text-sm text-slate-500 mb-4">
            By total investment
          </p>

          <div className="space-y-4">
            {clients.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-semibold text-slate-600">
                    {c.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      {c.units} units purchased
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  {c.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
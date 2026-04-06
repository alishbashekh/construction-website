import { useState } from "react";

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";
const fmt = (n) =>
  `Rs ${Math.abs(n).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CLIENTS_LIST = [
  "Sameer Shaikh (41302-2469092-7)",
  "Samantha Hurst (23132-1312312-2)",
  "Danish (41305-8987452-3)",
  "Nadeem Baig (42101-7654321-5)",
  "Ali Raza (35201-1122334-4)",
  "Bilal Ajmery (42000-1234567-9)",
  "Sara Ahmed (42201-3344556-8)",
  "Usman Malik (37405-5566778-2)",
  "Razia Sultana (61101-9988776-1)",
];

const LEDGER = {
  "Sameer Shaikh (41302-2469092-7)": [
    {
      date: "01/01/2026",
      description: "Booking – Unit 102",
      debit: 620000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00002",
    },
    {
      date: "01/01/2026",
      description: "Token Payment – 102",
      debit: 0,
      credit: 200000,
      type: "Credit",
      receipt: "PAY-00002",
    },
    {
      date: "31/03/2026",
      description: "Booking – Unit 108",
      debit: 3000000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00012",
    },
    {
      date: "31/03/2026",
      description: "Token Payment – 108",
      debit: 0,
      credit: 50000,
      type: "Credit",
      receipt: "PAY-00020",
    },
  ],
  "Samantha Hurst (23132-1312312-2)": [
    {
      date: "31/03/2026",
      description: "Booking – Unit 401",
      debit: 5000000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00011",
    },
    {
      date: "31/03/2026",
      description: "Token Payment",
      debit: 0,
      credit: 50000,
      type: "Credit",
      receipt: "PAY-00019",
    },
  ],
  "Danish (41305-8987452-3)": [
    {
      date: "10/03/2026",
      description: "Booking – Unit 301",
      debit: 22500000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00009",
    },
    {
      date: "01/02/2026",
      description: "Installment #1",
      debit: 0,
      credit: 2550000,
      type: "Credit",
      receipt: "PAY-00011",
    },
    {
      date: "05/02/2026",
      description: "Installment #2",
      debit: 0,
      credit: 5000000,
      type: "Credit",
      receipt: "PAY-00010",
    },
    {
      date: "20/02/2026",
      description: "Installment #3",
      debit: 0,
      credit: 5000000,
      type: "Credit",
      receipt: "PAY-00014",
    },
    {
      date: "01/03/2026",
      description: "Installment #4",
      debit: 0,
      credit: 5000000,
      type: "Credit",
      receipt: "PAY-00015",
    },
    {
      date: "10/03/2026",
      description: "Installment #5",
      debit: 0,
      credit: 5000000,
      type: "Credit",
      receipt: "PAY-00016",
    },
  ],
  "Nadeem Baig (42101-7654321-5)": [
    {
      date: "19/03/2026",
      description: "Booking – Unit 401",
      debit: 27500000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00010",
    },
    {
      date: "10/02/2026",
      description: "Installment #1",
      debit: 0,
      credit: 5000000,
      type: "Credit",
      receipt: "PAY-00012",
    },
    {
      date: "15/02/2026",
      description: "Installment #2",
      debit: 0,
      credit: 5000000,
      type: "Credit",
      receipt: "PAY-00013",
    },
    {
      date: "19/03/2026",
      description: "Final Payment",
      debit: 0,
      credit: 17500000,
      type: "Credit",
      receipt: "PAY-00017",
    },
  ],
  "Ali Raza (35201-1122334-4)": [
    {
      date: "05/03/2026",
      description: "Booking – Unit 201",
      debit: 4750000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00008",
    },
    {
      date: "15/01/2026",
      description: "Token Payment",
      debit: 0,
      credit: 950000,
      type: "Credit",
      receipt: "PAY-00008",
    },
  ],
  "Bilal Ajmery (42000-1234567-9)": [
    {
      date: "10/01/2026",
      description: "Booking – Unit 205",
      debit: 12000000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00004",
    },
    {
      date: "20/01/2026",
      description: "Installment #1",
      debit: 0,
      credit: 3000000,
      type: "Credit",
      receipt: "PAY-00009",
    },
    {
      date: "01/02/2026",
      description: "Installment #2",
      debit: 0,
      credit: 3000000,
      type: "Credit",
      receipt: "PAY-00010",
    },
    {
      date: "17/12/2025",
      description: "Token – Unit 102",
      debit: 0,
      credit: 450000,
      type: "Credit",
      receipt: "PAY-00004",
    },
  ],
  "Sara Ahmed (42201-3344556-8)": [
    {
      date: "20/02/2026",
      description: "Booking – Unit 205",
      debit: 3200000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00006",
    },
    {
      date: "05/01/2026",
      description: "Full Payment",
      debit: 0,
      credit: 3200000,
      type: "Credit",
      receipt: "PAY-00006",
    },
  ],
  "Usman Malik (37405-5566778-2)": [
    {
      date: "15/02/2026",
      description: "Booking – Unit 301",
      debit: 4200000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00005",
    },
    {
      date: "01/01/2026",
      description: "Token Payment",
      debit: 0,
      credit: 200000,
      type: "Credit",
      receipt: "PAY-00005",
    },
  ],
  "Razia Sultana (61101-9988776-1)": [
    {
      date: "28/02/2026",
      description: "Booking – Unit 302",
      debit: 5500000,
      credit: 0,
      type: "Debit",
      receipt: "BKG-00007",
    },
    {
      date: "10/01/2026",
      description: "Token Payment",
      debit: 0,
      credit: 1100000,
      type: "Credit",
      receipt: "PAY-00007",
    },
  ],
};

function ChevronDown() {
  return (
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function ClientLedger() {
  const [client, setClient] = useState("");
  const [results, setResults] = useState(null);

  function handleGenerate() {
    if (!client) return;
    const entries = LEDGER[client] || [];
    // compute running balance
    let bal = 0;
    const rows = entries.map((e) => {
      bal += e.credit - e.debit;
      return { ...e, balance: bal };
    });
    setResults(rows);
  }

  const totalDebits = (results ?? []).reduce((s, r) => s + r.debit, 0);
  const totalCredits = (results ?? []).reduce((s, r) => s + r.credit, 0);
  const netBalance = totalCredits - totalDebits;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-slate-800">Client Ledger</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View client-wise bookings, payments, and outstanding dues.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5 min-w-[220px]">
          <label className="text-sm font-semibold text-slate-700">
            Client{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <select
              value={client}
              onChange={(e) => {
                setClient(e.target.value);
                setResults(null);
              }}
              className={SEL}
            >
              <option value="">Select client</option>
              {CLIENTS_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={!client}
          className="px-10 py-[11px] rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] disabled:bg-[#a0c4de] disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-all self-end"
        >
          Generate
        </button>
      </div>

      {results === null ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center text-slate-400 text-sm">
          Select a client and click Generate to view ledger.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Debit (Bookings)</p>
              <p className="text-xl font-bold text-red-500 mt-1">
                {fmt(totalDebits)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Total Credit (Payments)</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">
                {fmt(totalCredits)}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-5">
              <p className="text-sm text-slate-500">Outstanding Balance</p>
              <p
                className={`text-xl font-bold mt-1 ${netBalance >= 0 ? "text-emerald-600" : "text-amber-500"}`}
              >
                {netBalance < 0 ? `-${fmt(-netBalance)}` : fmt(netBalance)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    {[
                      "DATE",
                      "RECEIPT #",
                      "DESCRIPTION",
                      "DEBIT (PKR)",
                      "CREDIT (PKR)",
                      "BALANCE",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap select-none"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-[17px] text-sm text-slate-700 whitespace-nowrap">
                        {row.date}
                      </td>
                      <td className="px-5 py-[17px] text-sm text-slate-700 whitespace-nowrap">
                        {row.receipt}
                      </td>
                      <td className="px-5 py-[17px] text-sm text-slate-700">
                        {row.description}
                      </td>
                      <td className="px-5 py-[17px] text-sm whitespace-nowrap">
                        {row.debit > 0 ? (
                          <span className="text-red-500 font-medium">
                            {fmt(row.debit)}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-[17px] text-sm whitespace-nowrap">
                        {row.credit > 0 ? (
                          <span className="text-emerald-600 font-medium">
                            {fmt(row.credit)}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-[17px] text-sm font-semibold whitespace-nowrap">
                        <span
                          className={
                            row.balance >= 0
                              ? "text-emerald-600"
                              : "text-amber-500"
                          }
                        >
                          {row.balance < 0
                            ? `-${fmt(-row.balance)}`
                            : fmt(row.balance)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {results.length} transaction{results.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

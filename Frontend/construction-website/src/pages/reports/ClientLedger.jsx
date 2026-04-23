import { useState, useEffect } from "react";
import { clientsAPI, reportsAPI } from "../../utils/apiService";

const SEL =
  "appearance-none pl-4 pr-10 py-[11px] rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer w-full";

const fmt = (n) =>
  `Rs ${Math.abs(Number(n) || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-PK") : "—";

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
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load clients list on mount for the dropdown
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await clientsAPI.getAll(1, 200);
        setClients(res?.data?.data ?? []);
      } catch {
        setClients([]);
      } finally {
        setClientsLoading(false);
      }
    }
    fetchClients();
  }, []);

  async function handleGenerate() {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      // API: GET /report/client-ledger/:clientId
      // Returns: { data: { client, bookings, payments, summary } }
      const res = await reportsAPI.clientLedger(selectedId);
      const { client, bookings, payments, summary } = res?.data?.data ?? {};

      // Build debit rows from bookings
      const bookingRows = (bookings ?? []).map((b) => ({
        date: b.bookingDate,
        receipt: b.bookingNumber || "—",
        description: `Booking – Unit ${b.flat?.flatNumber ?? ""}${
          b.project?.name ? ` (${b.project.name})` : ""
        }`,
        debit: b.bookingPrice,
        credit: 0,
      }));

      // Build credit/debit rows from payments
      const paymentRows = (payments ?? []).map((p) => ({
        date: p.paymentDate,
        receipt: p.receiptNumber || "—",
        description: p.isRefund
          ? `Refund – Unit ${p.flat?.flatNumber ?? ""}`
          : `Payment – Unit ${p.flat?.flatNumber ?? ""}${
              p.description ? ` (${p.description})` : ""
            }`,
        debit: p.isRefund ? p.amount : 0,
        credit: p.isRefund ? 0 : p.amount,
      }));

      // Merge and sort by date ascending
      const allRows = [...bookingRows, ...paymentRows].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Compute running balance
      let bal = 0;
      const rows = allRows.map((r) => {
        bal += r.credit - r.debit;
        return { ...r, balance: bal };
      });

      setResults({ rows, summary, client });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load ledger. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const rows = results?.rows ?? [];
  const totalDebits = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredits = rows.reduce((s, r) => s + r.credit, 0);
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
        <div className="flex flex-col gap-1.5 min-w-[260px]">
          <label className="text-sm font-semibold text-slate-700">Client</label>
          <div className="relative">
            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setResults(null);
                setError(null);
              }}
              className={SEL}
              disabled={clientsLoading}
            >
              <option value="">
                {clientsLoading ? "Loading clients..." : "Select client"}
              </option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.cnic})
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedId || loading}
          className="px-10 py-[11px] rounded-lg bg-[#1a6fa8] hover:bg-[#155d8f] disabled:bg-[#a0c4de] disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-all self-end"
        >
          {loading ? "Loading..." : "Generate"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {results === null && !loading ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center text-slate-400 text-sm">
          Select a client and click Generate to view ledger.
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl border border-slate-200 py-20 text-center text-slate-400 text-sm">
          Loading...
        </div>
      ) : (
        <>
          {/* Summary Cards */}
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
                className={`text-xl font-bold mt-1 ${
                  netBalance >= 0 ? "text-emerald-600" : "text-amber-500"
                }`}
              >
                {netBalance < 0 ? `-${fmt(-netBalance)}` : fmt(netBalance)}
              </p>
            </div>
          </div>

          {/* Ledger Table */}
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
                  {rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-16 text-center text-sm text-slate-400"
                      >
                        No transactions found for this client.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-[17px] text-sm text-slate-700 whitespace-nowrap">
                          {fmtDate(row.date)}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {rows.length} transaction{rows.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
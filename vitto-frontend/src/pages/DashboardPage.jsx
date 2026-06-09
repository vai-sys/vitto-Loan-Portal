import { useState, useEffect } from "react";
import { api } from "../api";
import { fmtCur, fmtDate, LANG_CLASSES, STATUS_CLASSES, DOT_CLASSES } from "../utils";
import StatCard from "../components/StatCard";
import StatusModal from "../components/StatusModal";

function Badge({ cls, dot, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
      {children}
    </span>
  );
}

export default function DashboardPage({ toast }) {
  const [apps, setApps] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalApp, setModalApp] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const [appsData, sumData] = await Promise.all([
        api.getApplications(filter),
        api.getSummary(),
      ]);
      setApps(appsData.applications);
      setSummary(sumData.data);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter]);

  function handleStatusSaved(updated) {
    setApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setModalApp(null);
    toast("Status updated successfully", "success");
    api.getSummary().then((d) => setSummary(d.data)).catch(() => {});
  }

  const displayed = apps.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.mobile.includes(search)
  );

  const FILTERS = ["all", "pending", "approved", "rejected"];
  const TH = "px-4 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap";
  const TD = "px-4 py-3.5 text-sm";

  return (
    <div className="pb-10">
     
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard label="Total Apps" value={summary.totalApplications} />
          <StatCard label="Total Requested" value={fmtCur(summary.totalLoanAmount)} />
          <StatCard label="Pending" value={summary.pending} valueColor="#D97706" />
          <StatCard label="Approved" value={summary.approved} valueColor="#10B981" />
          <StatCard label="Rejected" value={summary.rejected} valueColor="#EF4444" />
        </div>
      )}

     
      <div className="bg-white border border-gray-200 rounded-xl p-3.5 mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or mobile…"
          className="px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none
            focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 flex-1 min-w-[160px] max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-1 flex-wrap">
          {FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === s
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={load}
          className="ml-auto border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600
            px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all"
        >
          ↻ Refresh
        </button>
      </div>

      
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading applications…</div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className={TH}>Applicant</th>
                  <th className={TH}>Mobile</th>
                  <th className={TH}>Amount</th>
                  <th className={TH}>Purpose</th>
                  <th className={TH}>Language</th>
                  <th className={TH}>Status</th>
                  <th className={TH}>Date</th>
                  <th className={TH}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className={`${TD} font-semibold text-gray-900 whitespace-nowrap`}>
                      {app.name}
                    </td>
                    <td className={`${TD} text-gray-500 font-mono text-xs`}>{app.mobile}</td>
                    <td className={`${TD} font-semibold text-gray-900 whitespace-nowrap`}>
                      {fmtCur(app.amount)}
                    </td>
                    <td className={`${TD} text-gray-600`}>{app.purpose}</td>
                    <td className={TD}>
                      <Badge cls={LANG_CLASSES[app.language] || "bg-gray-100 text-gray-700"}>
                        {app.language}
                      </Badge>
                    </td>
                    <td className={TD}>
                      <Badge cls={STATUS_CLASSES[app.status]} dot={DOT_CLASSES[app.status]}>
                        {app.status}
                      </Badge>
                    </td>
                    <td className={`${TD} text-gray-400 whitespace-nowrap`}>
                      {fmtDate(app.created_at)}
                    </td>
                    <td className={TD}>
                      {app.status === "pending" ? (
                        <button
                          onClick={() => setModalApp(app)}
                          className="border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600
                            px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        >
                          Update
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalApp && (
        <StatusModal
          app={modalApp}
          onClose={() => setModalApp(null)}
          onSave={handleStatusSaved}
          onError={(msg) => toast(msg, "error")}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { api } from "../api";
import { fmtCur, STATUS_CLASSES, DOT_CLASSES } from "../utils";

export default function StatusModal({ app, onClose, onSave, onError }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!status) return;
    setLoading(true);
    try {
      const data = await api.updateStatus(app.id, status);
      onSave(data.application);
    } catch (e) {
      onError(e.message);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-2xl w-full max-w-[430px] p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-gray-900 text-lg">Update Status</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ✕
          </button>
        </div>

      
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="font-semibold text-gray-900 text-sm">{app.name}</p>
          <p className="text-gray-500 text-[13px] mt-0.5">
            {fmtCur(app.amount)} · {app.purpose}
          </p>
          <div className="mt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide
                ${STATUS_CLASSES[app.status]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${DOT_CLASSES[app.status]}`} />
              {app.status}
            </span>
          </div>
        </div>

      
        <label className="block text-[13px] font-semibold text-gray-700 mb-2">
          New Status
        </label>
        <div className="flex gap-3 mb-6">
          {["approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all
                ${status === s
                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!status || loading}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50
            text-white font-semibold text-sm rounded-xl transition-colors"
        >
          {loading ? "Saving…" : "Confirm Update"}
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import ApplyPage from "./pages/ApplyPage";
import DashboardPage from "./pages/DashboardPage";
import Toast from "./components/Toast";

export default function App() {
  const [page, setPage] = useState("apply");
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
     
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between">
         
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold font-display text-sm">V</span>
            </div>
            <span className="font-display font-bold text-gray-900 text-[17px]">Vitto</span>
            <span className="text-[11px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded ml-1">
              Loan Portal
            </span>
          </div>

         
          <nav className="flex gap-1">
            {[
              { id: "apply", label: "Apply" },
              { id: "dashboard", label: "Dashboard" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPage(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  page === tab.id
                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

  
      <main className="max-w-6xl mx-auto px-6 py-8">
        {page === "apply" && (
          <ApplyPage onSuccess={() => setPage("dashboard")} toast={showToast} />
        )}
        {page === "dashboard" && <DashboardPage toast={showToast} />}
      </main>

      {toast && (
        <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  );
}

import { useState } from "react";
import { api } from "../api";
import { PURPOSES, LANGUAGES } from "../utils";

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-gray-700">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none " +
  "transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 font-sans";

export default function ApplyPage({ toast }) {
  const [form, setForm] = useState({
    name: "", mobile: "", amount: "", purpose: "", language: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  function set(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter a valid loan amount";
    if (!form.purpose) e.purpose = "Select a purpose";
    if (!form.language) e.language = "Select a language";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const data = await api.createApplication({
        ...form,
        amount: Number(form.amount),
      });
      setSubmitted(data.application);
      toast("Application submitted successfully", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSubmitted(null);
    setForm({ name: "", mobile: "", amount: "", purpose: "", language: "" });
    setErrors({});
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-5">
          ✓
        </div>
        <h2 className="font-display font-bold text-gray-900 text-xl mb-2">
          Application Submitted
        </h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          Your application has been received and is pending review by the team.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl px-8 py-4 mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Reference ID
          </p>
          <p className="font-display font-bold text-indigo-600 text-xl tracking-wide">
            {submitted.id?.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-7">
        <h2 className="font-display font-bold text-gray-900 text-xl mb-1">
          New Loan Application
        </h2>
        <p className="text-gray-500 text-sm">
          Fill in the borrower details to submit a new application.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-7">
        <div className="grid gap-5">
          <Field label="Full Name" error={errors.name}>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              className={inputCls}
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Mobile Number" error={errors.mobile}>
              <input
                type="tel"
                placeholder="10-digit number"
                className={inputCls}
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
              />
            </Field>
            <Field label="Loan Amount (₹)" error={errors.amount}>
              <input
                type="number"
                placeholder="e.g. 50000"
                className={inputCls}
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Loan Purpose" error={errors.purpose}>
            <select
              className={inputCls + " appearance-none"}
              value={form.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            >
              <option value="">Select purpose</option>
              {PURPOSES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>

          <Field label="Preferred Language" error={errors.language}>
            <select
              className={inputCls + " appearance-none"}
              value={form.language}
              onChange={(e) => set("language", e.target.value)}
            >
              <option value="">Select language</option>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-1 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60
              text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StatCard({ label, value, valueColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p
        className="font-display font-bold text-2xl"
        style={{ color: valueColor || "#111827" }}
      >
        {value}
      </p>
    </div>
  );
}

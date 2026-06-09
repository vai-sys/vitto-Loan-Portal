import { useEffect } from "react";

export default function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, []);

  const accent = type === "success" ? "border-emerald-500" : "border-red-500";

  return (
    <div
      className={`fixed bottom-7 right-7 z-[999] flex items-center gap-3 bg-gray-900 text-white
        text-[13px] font-medium px-5 py-3 rounded-xl shadow-xl border-l-4 ${accent}
        animate-[slideUp_.3s_ease]`}
    >
      {msg}
    </div>
  );
}

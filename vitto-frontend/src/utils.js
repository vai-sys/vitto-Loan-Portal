export function fmtCur(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const LANG_CLASSES = {
  Hindi:   "bg-amber-100 text-amber-800",
  Tamil:   "bg-violet-100 text-violet-800",
  Telugu:  "bg-green-100  text-green-800",
  Marathi: "bg-red-100    text-red-800",
  English: "bg-blue-100   text-blue-800",
};

export const STATUS_CLASSES = {
  pending:  "bg-yellow-100 text-yellow-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

export const DOT_CLASSES = {
  pending:  "bg-amber-500",
  approved: "bg-emerald-500",
  rejected: "bg-red-500",
};

export const PURPOSES = [
  "Personal", "Business", "Agriculture", "Education",
  "Medical", "Home Repair", "Vehicle", "Other",
];

export const LANGUAGES = ["Hindi", "Tamil", "Telugu", "Marathi", "English"];

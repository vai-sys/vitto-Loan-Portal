const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  createApplication: (body) =>
    request("/applications", { method: "POST", body: JSON.stringify(body) }),

  getApplications: (status) =>
    request(`/applications${status && status !== "all" ? `?status=${status}` : ""}`),

  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getSummary: () => request("/summary"),
};

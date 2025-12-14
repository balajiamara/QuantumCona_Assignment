export const API_BASE = "https://quantumcona-assignment.onrender.com";

export async function apiRequest(path, options = {}) {
  const token = sessionStorage.getItem("access_token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // IMPORTANT (refresh cookie)
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

const API_BASE_URL = "https://abs-donum.vercel.app/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("adminToken");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

import { reviewSchema } from "../../../backend/controllers/aiController";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "dbdraw_token";

export const authStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export async function apiRequest(path, options = {}) {
  const token = authStore.getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) authStore.clear();
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

export const api = {

  register: (payload) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () =>
    apiRequest("/api/auth/me"),


  getProjects: () =>
    apiRequest("/api/projects"),

  createProject: (payload) =>
    apiRequest("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProject: (id, payload) =>
    apiRequest(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteProject: (id) =>
    apiRequest(`/api/projects/${id}`, {
      method: "DELETE",
    }),

 

  generateSchema: (payload) =>
    apiRequest("/api/ai/generate-schema", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  reviewSchema: (payload) => 
    apiRequest("/api/ai/review-schema", {
      method: "POST",
      body:JSON.stringify(payload),
    })
};

import axios from "axios";
import { getAuthToken } from "@/src/lib/auth";

const api = axios.create({
  baseURL: process.env.AUTH_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axios.post("/api/auth/refresh");
        const token = getAuthToken();
        if (token) original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        // If refresh fails, it's handled by generic auth guard or UI
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default api;

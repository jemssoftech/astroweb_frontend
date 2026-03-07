import axios from "axios";
import { getAuthToken } from "@/src/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Attach auth token and API key to every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Get API key from user object in localStorage
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const apiKey = user.userApiKey || user.apikey;
        if (apiKey) {
          config.headers["X-API-KEY"] = apiKey;
        }
      } catch (e) {
        console.error("Error parsing user for API key:", e);
      }
    }
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

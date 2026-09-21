import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? `${window.location.origin}/api`
    : "http://127.0.0.1:8000/api");

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token.startsWith("eyJ")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const storedToken = localStorage.getItem("token");
      if (storedToken && storedToken.startsWith("eyJ")) {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("userName");
      }
    }
    return Promise.reject(error);
  }
);

export const getBudgets = () => api.get("/budgets");
export const updateBudgets = (data) => api.put("/budgets", data);

export default api;



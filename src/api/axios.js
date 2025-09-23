import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // your Go backend
  headers: {
    "Content-Type": "application/json", // 👈 important
  },
});

// Add Authorization header automatically if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

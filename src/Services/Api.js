import axios from "axios";

// Create an Axios instance
export const api = axios.create({
  baseURL: "https://socialdm.reluconsultancy.org", // Base URL from config
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // Timeout for requests
});

// Interceptors for request/response (optional)
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

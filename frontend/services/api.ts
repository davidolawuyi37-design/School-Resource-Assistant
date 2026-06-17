import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("dd_world_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Backend is offline. Start the FastAPI server on http://localhost:8000 and try again."));
    }

    const detail = error.response.data?.detail;
    if (typeof detail === "string") {
      return Promise.reject(new Error(detail));
    }

    return Promise.reject(error);
  }
);

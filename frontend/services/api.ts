import axios from "axios";
import { API_BASE_URL } from "@/lib/api-config";
import { getClerkToken } from "@/services/clerk-token";

export const API_URL = API_BASE_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use(async (config) => {
  const token = await getClerkToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Unable to reach the backend. Please check your deployed API URL and try again."));
    }

    const detail = error.response.data?.detail;
    if (typeof detail === "string") {
      return Promise.reject(new Error(detail));
    }

    return Promise.reject(error);
  }
);

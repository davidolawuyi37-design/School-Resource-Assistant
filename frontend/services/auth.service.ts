import { api } from "@/services/api";
import type { User } from "@/types";

export type AuthPayload = {
  email: string;
  password: string;
  full_name?: string;
};

export async function signup(payload: Required<AuthPayload>) {
  const { data } = await api.post<{ access_token: string }>("/auth/signup", payload);
  return data;
}

export async function login(payload: AuthPayload) {
  const { data } = await api.post<{ access_token: string }>("/auth/login", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

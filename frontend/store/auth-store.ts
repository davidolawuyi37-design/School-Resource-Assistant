import { create } from "zustand";

import type { User } from "@/types";

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? window.localStorage.getItem("dd_world_token") : null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== "undefined") window.localStorage.setItem("dd_world_token", token);
    set({ token });
  },
  logout: () => {
    if (typeof window !== "undefined") window.localStorage.removeItem("dd_world_token");
    set({ token: null, user: null });
  }
}));

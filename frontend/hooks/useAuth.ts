import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { getMe, login, signup } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const query = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    enabled: typeof window !== "undefined" && Boolean(window.localStorage.getItem("dd_world_token"))
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return query;
}

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.access_token);
      localStorage.setItem("dd_world_token", data.access_token);
    }
  });
}

export function useSignup() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      setToken(data.access_token);
      localStorage.setItem("dd_world_token", data.access_token);
    }
  });
}
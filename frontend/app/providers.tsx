"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setClerkTokenProvider } from "@/services/clerk-token";

const queryClient = new QueryClient();

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();
  setClerkTokenProvider(() => getToken());

  useEffect(() => {
    setClerkTokenProvider(() => getToken());
  }, [getToken]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

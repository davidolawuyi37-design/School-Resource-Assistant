"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { AnimatedButton } from "@/components/AnimatedButton";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AnimatedButton
      aria-label="Toggle theme"
      variant="secondary"
      className="h-11 w-11 rounded-full p-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </AnimatedButton>
  );
}

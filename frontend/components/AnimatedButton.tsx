"use client";
/** @jsxRuntime classic */
/** @jsx React.createElement */

import * as React from "react";
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type AnimatedButtonProps = ComponentPropsWithoutRef<typeof motion.button> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function AnimatedButton({ className, variant = "primary", children, ...props }: AnimatedButtonProps) {
  return (
    
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-primary text-primary-foreground shadow-glow hover:brightness-110",
        variant === "secondary" && "glass text-foreground hover:bg-white/70 dark:hover:bg-white/10",
        variant === "ghost" && "hover:bg-muted",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

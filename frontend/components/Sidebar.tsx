"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, History, Home, MessageSquareText, Settings, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/workspace", label: "AI Tutor", icon: MessageSquareText },
  { href: "/quiz", label: "Quiz Studio", icon: Trophy },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-card/70 p-4 backdrop-blur-xl lg:block">
      <Link href="/" className="mb-8 flex items-center gap-3 rounded-2xl p-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <p className="font-black">DD WORLD</p>
          <p className="text-xs text-muted-foreground">Learning OS</p>
        </div>
      </Link>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-2xl border bg-background/60 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold">
          <BarChart3 className="h-4 w-4 text-primary" />
          Today
        </div>
        <p className="text-3xl font-black">42 min</p>
        <p className="mt-1 text-xs text-muted-foreground">Your best learning rhythm is after focused explanations.</p>
      </div>
    </aside>
  );
}

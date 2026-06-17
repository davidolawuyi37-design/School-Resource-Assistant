import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  className?: string;
};

export function DashboardCard({ title, value, detail, icon, className }: DashboardCardProps) {
  return (
    <div className={cn("glass rounded-2xl p-5 shadow-panel", className)}>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">{icon}</div>
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

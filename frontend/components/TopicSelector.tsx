"use client";

import { BookMarked } from "lucide-react";

export function TopicSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <BookMarked className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter topic"
        className="h-12 w-full rounded-xl border bg-background/70 pl-11 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

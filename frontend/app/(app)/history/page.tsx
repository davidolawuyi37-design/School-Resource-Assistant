"use client";

import { Clock3 } from "lucide-react";

import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useLearningSessions } from "@/hooks/useLearning";

export default function HistoryPage() {
  const sessions = useLearningSessions();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-primary">Learning history</p>
        <h1 className="text-3xl font-black">Continue where you stopped</h1>
      </div>
      <div className="grid gap-4">
        {sessions.isLoading && Array.from({ length: 5 }).map((_, index) => <LoadingSkeleton key={index} className="h-28" />)}
        {(sessions.data ?? []).map((session) => (
          <article key={session.id} className="glass rounded-2xl p-5 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-primary">{session.education_level} · {session.subject}</p>
                <h2 className="mt-1 text-xl font-black">{session.topic}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{session.summary ?? "No summary yet."}</p>
              </div>
              <Clock3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </article>
        ))}
        {!sessions.isLoading && !sessions.data?.length && (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">Your saved learning sessions will appear here.</div>
        )}
      </div>
    </div>
  );
}

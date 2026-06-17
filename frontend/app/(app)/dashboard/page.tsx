"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { BookOpen, Flame, GraduationCap, Target } from "lucide-react";

import { DashboardCard } from "@/components/DashboardCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useLearningSessions } from "@/hooks/useLearning";
import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "@/services/analytics.service";

export default function DashboardPage() {
  const analytics = useQuery({ queryKey: ["analytics"], queryFn: getAnalyticsSummary });
  const sessions = useLearningSessions();
  const data = analytics.data?.weekly_minutes.map((minutes, index) => ({ day: ["M", "T", "W", "T", "F", "S", "S"][index], minutes })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold text-primary">Learning dashboard</p>
        <h1 className="text-3xl font-black tracking-tight">Your progress, beautifully organized</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analytics.isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <LoadingSkeleton key={index} className="h-40" />)
        ) : (
          <>
            <DashboardCard title="Learning streak" value={`${analytics.data?.streak_days ?? 0} days`} detail="Consistency compounds fast." icon={<Flame className="h-5 w-5" />} />
            <DashboardCard title="Subjects studied" value={`${analytics.data?.subjects_studied ?? 0}`} detail="Across your active curriculum." icon={<BookOpen className="h-5 w-5" />} />
            <DashboardCard title="Quiz average" value={`${analytics.data?.average_quiz_score ?? 0}%`} detail="Smart grading with explanations." icon={<Target className="h-5 w-5" />} />
            <DashboardCard title="Sessions" value={`${analytics.data?.sessions_completed ?? 0}`} detail="Saved for continuation." icon={<GraduationCap className="h-5 w-5" />} />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_.8fr]">
        <section className="glass rounded-2xl p-5 shadow-panel">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Weekly learning minutes</h2>
              <p className="text-sm text-muted-foreground">Animated progress chart</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(45, 212, 191, .1)" }} />
                <Bar dataKey="minutes" fill="#2dd4bf" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="glass rounded-2xl p-5 shadow-panel">
          <h2 className="text-xl font-black">Weak topic analysis</h2>
          <div className="mt-5 space-y-3">
            {(analytics.data?.weak_topics ?? ["Algebra foundations", "Essay structure", "Scientific method"]).map((topic) => (
              <div key={topic} className="rounded-xl border bg-background/70 p-4 text-sm font-semibold">
                {topic}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="glass rounded-2xl p-5 shadow-panel">
          <h2 className="text-xl font-black">Recent sessions</h2>
          <div className="mt-5 space-y-3">
            {(sessions.data ?? []).slice(0, 5).map((session) => (
              <div key={session.id} className="rounded-xl border bg-background/70 p-4">
                <p className="font-bold">{session.topic}</p>
                <p className="text-sm text-muted-foreground">{session.education_level} · {session.subject}</p>
              </div>
            ))}
            {!sessions.data?.length && <p className="text-sm text-muted-foreground">Start a lesson in the AI Tutor workspace.</p>}
          </div>
        </section>
        <section className="glass rounded-2xl p-5 shadow-panel">
          <h2 className="text-xl font-black">AI recommendations</h2>
          <div className="mt-5 space-y-3">
            {(analytics.data?.recommended_topics ?? []).map((topic) => (
              <div key={topic} className="rounded-xl border bg-background/70 p-4 text-sm font-semibold">{topic}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

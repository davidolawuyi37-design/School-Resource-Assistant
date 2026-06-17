"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Bot, Send, Sparkles, UserRound } from "lucide-react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { SubjectSelector } from "@/components/SubjectSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { useAskTutor } from "@/hooks/useLearning";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useSessionStore } from "@/store/session-store";
import type { EducationLevel } from "@/types";

const levels: EducationLevel[] = ["Early Childhood", "Primary", "Secondary", "Tertiary"];

export function AIChat() {
  const [input, setInput] = useState("");
  const { mutateAsync, isPending } = useAskTutor();
  const { activeSessionId, setActiveSessionId } = useSessionStore();
  const { educationLevel, subject, topic, messages, setLearningContext, addMessage } = useChatStore();

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!input.trim() || isPending) return;
    const learnerMessage = input.trim();
    const userMessage = { id: crypto.randomUUID(), role: "learner" as const, content: learnerMessage };
    addMessage(userMessage);
    setInput("");
    const streamId = crypto.randomUUID();
    addMessage({ id: streamId, role: "assistant", content: "Thinking through this step by step...", isStreaming: true });
    try {
      const response = await mutateAsync({
        session_id: activeSessionId,
        education_level: educationLevel,
        subject,
        topic,
        message: learnerMessage
      });
      setActiveSessionId(response.session_id);
      useChatStore.getState().updateMessage(streamId, response.answer);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tutor request failed. Please try again.";
      useChatStore.getState().updateMessage(streamId, message);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[320px_1fr]">
      <section className="glass rounded-2xl p-5 shadow-panel">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-black">Tutor Controls</h2>
            <p className="text-xs text-muted-foreground">Personalize the lesson</p>
          </div>
        </div>
        <div className="space-y-4">
          <select
            value={educationLevel}
            onChange={(event) => setLearningContext({ educationLevel: event.target.value as EducationLevel })}
            className="h-12 w-full rounded-xl border bg-background/70 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
          >
            {levels.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
          <SubjectSelector value={subject} onChange={(value) => setLearningContext({ subject: value })} />
          <TopicSelector value={topic} onChange={(value) => setLearningContext({ topic: value })} />
          <Link href={`/quiz?level=${encodeURIComponent(educationLevel)}&subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`}>
            <AnimatedButton className="w-full" type="button">
              Generate Quiz
            </AnimatedButton>
          </Link>
        </div>
      </section>

      <section className="glass flex min-h-[720px] flex-col rounded-2xl shadow-panel">
        <div className="border-b p-5">
          <p className="text-xs font-bold uppercase text-primary">{educationLevel} · {subject}</p>
          <h1 className="mt-1 text-2xl font-black">{topic}</h1>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex gap-3", message.role === "learner" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[820px] rounded-2xl px-5 py-4 text-sm leading-7",
                  message.role === "learner" ? "bg-primary text-primary-foreground" : "bg-background/80"
                )}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {message.isStreaming && <span className="ml-1 inline-block h-2 w-2 animate-pulse-soft rounded-full bg-primary" />}
              </div>
              {message.role === "learner" && (
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <UserRound className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="border-t p-4">
          <div className="flex gap-3 rounded-2xl border bg-background/80 p-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask for an explanation, examples, re-explanation, assignment, or flashcards..."
              className="min-h-12 flex-1 bg-transparent px-3 text-sm outline-none"
            />
            <AnimatedButton disabled={isPending} type="submit" className="rounded-xl">
              <Send className="h-4 w-4" />
              Send
            </AnimatedButton>
          </div>
        </form>
      </section>
    </div>
  );
}

"use client";

import { CheckCircle2 } from "lucide-react";

import type { QuizQuestion } from "@/types";

export function QuizCard({
  question,
  selected,
  onSelect
}: {
  question: QuizQuestion;
  selected?: string;
  onSelect: (answer: string) => void;
}) {
  const isWrittenAnswer = question.options.length === 0;

  return (
    <div className="glass rounded-2xl p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase text-primary">{question.type.replace("_", " ")}</p>
        {selected && <CheckCircle2 className="h-5 w-5 text-success" />}
      </div>
      <h3 className="text-lg font-black leading-snug">{question.question}</h3>
      {isWrittenAnswer ? (
        <textarea
          value={selected ?? ""}
          onChange={(event) => onSelect(event.target.value)}
          placeholder="Type your answer..."
          className="mt-5 min-h-28 w-full rounded-xl border bg-background/70 p-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`rounded-xl border p-4 text-left text-sm font-semibold transition hover:border-primary hover:bg-primary/10 ${
                selected === option.id ? "border-primary bg-primary/15 text-primary" : "bg-background/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Trophy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { AnimatedButton } from "@/components/AnimatedButton";
import { QuizCard } from "@/components/QuizCard";
import { SubjectSelector } from "@/components/SubjectSelector";
import { TopicSelector } from "@/components/TopicSelector";
import { generateQuiz, submitQuiz } from "@/services/quiz.service";
import type { EducationLevel, QuizQuestion, QuizResult } from "@/types";

const levels: EducationLevel[] = ["Early Childhood", "Primary", "Secondary", "Tertiary"];

function QuizContent() {
  const searchParams = useSearchParams();
  const [educationLevel, setEducationLevel] = useState<EducationLevel>((searchParams.get("level") as EducationLevel) || "Secondary");
  const [subject, setSubject] = useState(searchParams.get("subject") || "Mathematics");
  const [topic, setTopic] = useState(searchParams.get("topic") || "Algebra");
  const [quizId, setQuizId] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const generator = useMutation({ mutationFn: generateQuiz });
  const submitter = useMutation({ mutationFn: submitQuiz });

  async function createQuiz() {
    setError("");
    try {
      const quiz = await generator.mutateAsync({ education_level: educationLevel, subject, topic, count: 8 });
      setQuizId(quiz.id);
      setQuestions(quiz.questions);
      setAnswers({});
      setResult(null);
    } catch {
      setError("Quiz generation failed. Please confirm you are logged in and the backend is running.");
    }
  }

  async function gradeQuiz() {
    setError("");
    try {
      const response = await submitter.mutateAsync({
        quiz_id: quizId,
        answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id, answer }))
      });
      setResult(response);
    } catch {
      setError("Quiz grading failed. Please answer at least one question and try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 shadow-panel">
        <p className="text-sm font-bold text-primary">Quiz studio</p>
        <h1 className="text-3xl font-black">Generate, answer, and learn from smart quizzes</h1>
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto]">
          <select value={educationLevel} onChange={(event) => setEducationLevel(event.target.value as EducationLevel)} className="h-12 rounded-xl border bg-background/70 px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring">
            {levels.map((level) => <option key={level}>{level}</option>)}
          </select>
          <SubjectSelector value={subject} onChange={setSubject} />
          <TopicSelector value={topic} onChange={setTopic} />
          <AnimatedButton disabled={generator.isPending} onClick={createQuiz}>
            <Trophy className="h-4 w-4" />
            Generate
          </AnimatedButton>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-coral bg-coral/10 p-4 text-sm font-semibold text-coral">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-primary bg-primary/10 p-5 text-primary">
          <p className="text-lg font-black">Score: {result.score}/{result.total}</p>
          {result.explanation && <p className="mt-2 text-sm text-foreground">{result.explanation}</p>}
          {result.weak_areas.length > 0 && (
            <p className="mt-3 text-sm text-foreground">Focus areas: {result.weak_areas.join(", ")}</p>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {questions.map((question) => (
          <QuizCard
            key={question.id}
            question={question}
            selected={answers[question.id]}
            onSelect={(answer) => setAnswers((current) => ({ ...current, [question.id]: answer }))}
          />
        ))}
      </div>

      {questions.length > 0 && (
        <AnimatedButton disabled={submitter.isPending} onClick={gradeQuiz} className="w-full md:w-auto">
          Submit answers
        </AnimatedButton>
      )}

      {result?.graded_answers?.length ? (
        <div className="glass rounded-2xl p-5 shadow-panel">
          <h2 className="text-xl font-black">Answer feedback</h2>
          <div className="mt-4 space-y-3">
            {result.graded_answers.map((item) => (
              <div key={item.question_id} className="rounded-xl border bg-background/70 p-4 text-sm">
                <p className={item.correct ? "font-bold text-success" : "font-bold text-coral"}>
                  {item.correct ? "Correct" : "Needs review"} · {item.question_id}
                </p>
                {item.feedback && <p className="mt-2 text-muted-foreground">{item.feedback}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="glass rounded-2xl p-5 shadow-panel">Loading quiz studio...</div>}>
      <QuizContent />
    </Suspense>
  );
}

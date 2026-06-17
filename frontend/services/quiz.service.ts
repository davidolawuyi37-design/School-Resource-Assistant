import { api } from "@/services/api";
import type { EducationLevel, QuizQuestion, QuizResult } from "@/types";

export async function generateQuiz(payload: {
  session_id?: string;
  education_level: EducationLevel;
  subject: string;
  topic: string;
  count?: number;
}) {
  const { data } = await api.post<{ id: string; questions: QuizQuestion[] }>("/quiz/generate", payload);
  return data;
}

export async function submitQuiz(payload: { quiz_id: string; answers: { question_id: string; answer: string }[] }) {
  const { data } = await api.post<QuizResult>("/quiz/submit", payload);
  return data;
}

export async function getQuizHistory() {
  const { data } = await api.get("/quiz/history");
  return data;
}

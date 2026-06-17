import { api } from "@/services/api";
import type { EducationLevel, LearningSession } from "@/types";

export async function createLearningSession(payload: {
  education_level: EducationLevel;
  subject: string;
  topic: string;
}) {
  const { data } = await api.post<LearningSession>("/learning/sessions", payload);
  return data;
}

export async function getLearningSessions() {
  const { data } = await api.get<LearningSession[]>("/learning/sessions");
  return data;
}

export async function askTutor(payload: {
  session_id?: string;
  education_level: EducationLevel;
  subject: string;
  topic: string;
  message: string;
  mode?: string;
}) {
  const { data } = await api.post<{ session_id: string; answer: string }>("/learning/tutor", payload);
  return data;
}

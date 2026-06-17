export type EducationLevel = "Early Childhood" | "Primary" | "Secondary" | "Tertiary";

export type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

export type LearningSession = {
  id: string;
  education_level: EducationLevel | string;
  subject: string;
  topic: string;
  summary?: string | null;
  mastery_score: number;
};

export type ChatMessage = {
  id: string;
  role: "learner" | "assistant";
  content: string;
  isStreaming?: boolean;
};

export type QuizQuestion = {
  id: string;
  type: string;
  question: string;
  options: { id: string; label: string }[];
  answer?: string | null;
  explanation?: string | null;
  skill?: string | null;
};

export type QuizResult = {
  id: string;
  score: number;
  total: number;
  weak_areas: string[];
  explanation?: string | null;
  graded_answers: {
    question_id: string;
    correct: boolean;
    expected?: string;
    answer?: string;
    feedback?: string;
  }[];
};

export type AnalyticsSummary = {
  streak_days: number;
  subjects_studied: number;
  sessions_completed: number;
  average_quiz_score: number;
  weak_topics: string[];
  recommended_topics: string[];
  weekly_minutes: number[];
};

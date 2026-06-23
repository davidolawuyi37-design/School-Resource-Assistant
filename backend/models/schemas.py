from typing import Literal

from pydantic import BaseModel, Field


EducationLevel = Literal["Early Childhood", "Primary", "Secondary", "Tertiary"]


class User(BaseModel):
    id: str
    full_name: str
    email: str
    role: str = "student"


class LearningSessionCreate(BaseModel):
    education_level: EducationLevel
    subject: str = Field(..., min_length=1)
    topic: str = Field(..., min_length=1)


class LearningSession(BaseModel):
    id: str
    education_level: str
    subject: str
    topic: str
    summary: str | None = None
    mastery_score: int = 0


class TutorRequest(BaseModel):
    session_id: str | None = None
    education_level: EducationLevel
    subject: str
    topic: str
    message: str = Field(..., min_length=1)
    mode: str | None = "teach"


class TutorResponse(BaseModel):
    session_id: str
    answer: str


class QuizGenerateRequest(BaseModel):
    session_id: str | None = None
    education_level: EducationLevel
    subject: str
    topic: str
    count: int = Field(default=8, ge=1, le=12)


class QuizOption(BaseModel):
    id: str
    label: str


class QuizQuestion(BaseModel):
    id: str
    type: str = "multiple_choice"
    question: str
    options: list[QuizOption]
    answer: str | None = None
    explanation: str | None = None
    skill: str | None = None


class QuizGenerateResponse(BaseModel):
    id: str
    questions: list[QuizQuestion]


class QuizAnswer(BaseModel):
    question_id: str
    answer: str


class QuizSubmitRequest(BaseModel):
    quiz_id: str
    answers: list[QuizAnswer]


class GradedAnswer(BaseModel):
    question_id: str
    correct: bool
    expected: str | None = None
    answer: str | None = None
    feedback: str | None = None


class QuizResult(BaseModel):
    id: str
    score: int
    total: int
    weak_areas: list[str]
    explanation: str | None = None
    graded_answers: list[GradedAnswer]


class AnalyticsSummary(BaseModel):
    streak_days: int
    subjects_studied: int
    sessions_completed: int
    average_quiz_score: int
    weak_topics: list[str]
    recommended_topics: list[str]
    weekly_minutes: list[int]

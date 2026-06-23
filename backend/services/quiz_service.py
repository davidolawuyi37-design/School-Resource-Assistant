from __future__ import annotations

from uuid import uuid4

from models.schemas import QuizResult
from services.ai_service import ai_service
from services.session_store import store


def generate_quiz(user_id: str, education_level: str, subject: str, topic: str, count: int, session_id: str | None = None) -> dict:
    quiz_id = str(uuid4())
    questions = ai_service.generate_quiz(education_level, subject, topic, count)
    quiz = {
        "id": quiz_id,
        "user_id": user_id,
        "session_id": session_id,
        "education_level": education_level,
        "subject": subject,
        "topic": topic,
        "questions": questions,
    }
    store.save_quiz(quiz_id, quiz)
    return {"id": quiz_id, "questions": questions}


def submit_quiz(user_id: str, quiz_id: str, answers: list[dict]) -> QuizResult:
    quiz = store.get_quiz(quiz_id)
    if not quiz or quiz.get("user_id") != user_id:
        raise ValueError("Quiz not found. Please generate a new quiz.")

    answer_map = {item["question_id"]: item["answer"] for item in answers}
    graded_answers = []
    weak_areas = set()
    score = 0

    for question in quiz["questions"]:
        expected = question.get("answer")
        actual = answer_map.get(question["id"])
        correct = bool(actual and expected and actual == expected)
        if correct:
            score += 1
        else:
            weak_areas.add(question.get("skill") or quiz.get("topic") or "Review")

        graded_answers.append({
            "question_id": question["id"],
            "correct": correct,
            "expected": expected,
            "answer": actual,
            "feedback": question.get("explanation"),
        })

    total = len(quiz["questions"])
    percent = round((score / total) * 100) if total else 0
    explanation = f"You scored {score} out of {total} ({percent}%). Review the explanations and retry weak areas."
    result = {
        "id": str(uuid4()),
        "user_id": user_id,
        "score": score,
        "total": total,
        "weak_areas": sorted(weak_areas),
        "explanation": explanation,
        "graded_answers": graded_answers,
    }
    store.save_quiz_result(result)
    return QuizResult(**{key: value for key, value in result.items() if key != "user_id"})

from fastapi import APIRouter

from models.schemas import AnalyticsSummary
from services.session_store import store


router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def summary():
    sessions = store.list_sessions()
    quiz_results = store.list_quiz_results()
    subjects = {session.subject for session in sessions}

    average_score = 0
    if quiz_results:
        percentages = [
            round((item["score"] / item["total"]) * 100)
            for item in quiz_results
            if item.get("total")
        ]
        average_score = round(sum(percentages) / len(percentages)) if percentages else 0

    weak_topics = []
    for item in quiz_results:
        weak_topics.extend(item.get("weak_areas", []))

    recent_topics = [session.topic for session in sessions[:3]]
    recommended = recent_topics or ["Algebra foundations", "Scientific method", "Essay structure"]

    return {
        "streak_days": 3 if sessions else 0,
        "subjects_studied": len(subjects),
        "sessions_completed": len(sessions),
        "average_quiz_score": average_score,
        "weak_topics": weak_topics[:5] or ["Algebra foundations", "Essay structure", "Scientific method"],
        "recommended_topics": recommended,
        "weekly_minutes": [20, 35, 25, 45, 30, 50, 40] if sessions else [0, 0, 0, 0, 0, 0, 0],
    }

from fastapi import APIRouter

from models.schemas import LearningSession, LearningSessionCreate, TutorRequest, TutorResponse
from services.ai_service import ai_service
from services.session_store import store


router = APIRouter(prefix="/learning", tags=["learning"])


@router.post("/tutor", response_model=TutorResponse)
def ask_tutor(payload: TutorRequest):
    answer = ai_service.answer_tutor(
        education_level=payload.education_level,
        subject=payload.subject,
        topic=payload.topic,
        message=payload.message,
        mode=payload.mode,
    )
    session = store.upsert_session(
        session_id=payload.session_id,
        education_level=payload.education_level,
        subject=payload.subject,
        topic=payload.topic,
        summary=f"{payload.subject}: {payload.topic}. Last question: {payload.message[:90]}",
    )
    return {"session_id": session.id, "answer": answer}


@router.get("/sessions", response_model=list[LearningSession])
def list_sessions():
    return store.list_sessions()


@router.post("/sessions", response_model=LearningSession)
def create_session(payload: LearningSessionCreate):
    return store.create_session(
        education_level=payload.education_level,
        subject=payload.subject,
        topic=payload.topic,
    )

from fastapi import APIRouter, HTTPException

from models.schemas import QuizGenerateRequest, QuizGenerateResponse, QuizResult, QuizSubmitRequest
from services import quiz_service
from services.session_store import store


router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/generate", response_model=QuizGenerateResponse)
def generate(payload: QuizGenerateRequest):
    return quiz_service.generate_quiz(
        session_id=payload.session_id,
        education_level=payload.education_level,
        subject=payload.subject,
        topic=payload.topic,
        count=payload.count,
    )


@router.post("/submit", response_model=QuizResult)
def submit(payload: QuizSubmitRequest):
    try:
        return quiz_service.submit_quiz(
            quiz_id=payload.quiz_id,
            answers=[answer.model_dump() for answer in payload.answers],
        )
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.get("/history")
def history():
    return store.list_quiz_results()

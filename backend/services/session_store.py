from __future__ import annotations

import json
from pathlib import Path
from threading import Lock
from uuid import uuid4

from models.schemas import LearningSession


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "store.json"


def _default_data() -> dict:
    return {
        "sessions": [],
        "quizzes": {},
        "quiz_results": [],
    }


class SessionStore:
    def __init__(self) -> None:
        self._lock = Lock()
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        if not DATA_PATH.exists():
            DATA_PATH.write_text(json.dumps(_default_data(), indent=2), encoding="utf-8")

    def _read(self) -> dict:
        try:
            return json.loads(DATA_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, FileNotFoundError):
            return _default_data()

    def _write(self, data: dict) -> None:
        DATA_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def create_session(self, user_id: str, education_level: str, subject: str, topic: str, summary: str | None = None) -> LearningSession:
        with self._lock:
            data = self._read()
            session = {
                "id": str(uuid4()),
                "user_id": user_id,
                "education_level": education_level,
                "subject": subject,
                "topic": topic,
                "summary": summary or f"Learning session for {topic} in {subject}.",
                "mastery_score": 0,
            }
            data["sessions"].insert(0, session)
            self._write(data)
            return LearningSession(**{key: value for key, value in session.items() if key != "user_id"})

    def upsert_session(self, user_id: str, session_id: str | None, education_level: str, subject: str, topic: str, summary: str) -> LearningSession:
        with self._lock:
            data = self._read()
            sessions = data["sessions"]
            if session_id:
                for item in sessions:
                    if item["id"] == session_id and item.get("user_id") == user_id:
                        item.update({
                            "education_level": education_level,
                            "subject": subject,
                            "topic": topic,
                            "summary": summary,
                        })
                        self._write(data)
                        return LearningSession(**{key: value for key, value in item.items() if key != "user_id"})

            session = {
                "id": str(uuid4()),
                "user_id": user_id,
                "education_level": education_level,
                "subject": subject,
                "topic": topic,
                "summary": summary,
                "mastery_score": 0,
            }
            sessions.insert(0, session)
            self._write(data)
            return LearningSession(**{key: value for key, value in session.items() if key != "user_id"})

    def list_sessions(self, user_id: str) -> list[LearningSession]:
        data = self._read()
        return [
            LearningSession(**{key: value for key, value in item.items() if key != "user_id"})
            for item in data.get("sessions", [])
            if item.get("user_id") == user_id
        ]

    def save_quiz(self, quiz_id: str, quiz: dict) -> None:
        with self._lock:
            data = self._read()
            data["quizzes"][quiz_id] = quiz
            self._write(data)

    def get_quiz(self, quiz_id: str) -> dict | None:
        data = self._read()
        return data.get("quizzes", {}).get(quiz_id)

    def save_quiz_result(self, result: dict) -> None:
        with self._lock:
            data = self._read()
            data["quiz_results"].insert(0, result)
            self._write(data)

    def list_quiz_results(self, user_id: str) -> list[dict]:
        data = self._read()
        return [
            {key: value for key, value in item.items() if key != "user_id"}
            for item in data.get("quiz_results", [])
            if item.get("user_id") == user_id
        ]


store = SessionStore()

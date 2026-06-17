from __future__ import annotations

import hashlib
import json
from pathlib import Path
from threading import Lock
from uuid import uuid4

from models.schemas import LearningSession, User


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "store.json"


def _default_data() -> dict:
    return {
        "users": {},
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

    @staticmethod
    def hash_password(password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()

    def create_user(self, full_name: str, email: str, password: str) -> User:
        with self._lock:
            data = self._read()
            email_key = email.lower()
            existing = data["users"].get(email_key)
            if existing:
                return User(**existing["profile"])

            profile = {
                "id": str(uuid4()),
                "full_name": full_name,
                "email": email_key,
                "role": "student",
            }
            data["users"][email_key] = {
                "profile": profile,
                "password_hash": self.hash_password(password),
            }
            self._write(data)
            return User(**profile)

    def authenticate_user(self, email: str, password: str) -> User | None:
        data = self._read()
        record = data["users"].get(email.lower())
        if not record:
            return None
        if record["password_hash"] != self.hash_password(password):
            return None
        return User(**record["profile"])

    def get_user_by_email(self, email: str) -> User | None:
        data = self._read()
        record = data["users"].get(email.lower())
        return User(**record["profile"]) if record else None

    def create_session(self, education_level: str, subject: str, topic: str, summary: str | None = None) -> LearningSession:
        with self._lock:
            data = self._read()
            session = {
                "id": str(uuid4()),
                "education_level": education_level,
                "subject": subject,
                "topic": topic,
                "summary": summary or f"Learning session for {topic} in {subject}.",
                "mastery_score": 0,
            }
            data["sessions"].insert(0, session)
            self._write(data)
            return LearningSession(**session)

    def upsert_session(self, session_id: str | None, education_level: str, subject: str, topic: str, summary: str) -> LearningSession:
        with self._lock:
            data = self._read()
            sessions = data["sessions"]
            if session_id:
                for item in sessions:
                    if item["id"] == session_id:
                        item.update({
                            "education_level": education_level,
                            "subject": subject,
                            "topic": topic,
                            "summary": summary,
                        })
                        self._write(data)
                        return LearningSession(**item)

            session = {
                "id": str(uuid4()),
                "education_level": education_level,
                "subject": subject,
                "topic": topic,
                "summary": summary,
                "mastery_score": 0,
            }
            sessions.insert(0, session)
            self._write(data)
            return LearningSession(**session)

    def list_sessions(self) -> list[LearningSession]:
        data = self._read()
        return [LearningSession(**item) for item in data.get("sessions", [])]

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

    def list_quiz_results(self) -> list[dict]:
        data = self._read()
        return data.get("quiz_results", [])


store = SessionStore()

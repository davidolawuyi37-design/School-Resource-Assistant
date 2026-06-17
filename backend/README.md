# Backend

FastAPI backend for the DD World School Resource Assistant frontend.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

API docs:

```text
http://localhost:8000/docs
```

## Environment

```env
LLM_API_KEY=
LLM_PROVIDER=deepseek
MODEL_NAME=deepseek-chat
LLM_BASE_URL=https://api.deepseek.com
LLM_TEMPERATURE=0.2
```

If `LLM_API_KEY` is empty, the backend returns local fallback lessons and quizzes so the frontend can still run.

## Routes

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/learning/tutor`
- `GET /api/v1/learning/sessions`
- `POST /api/v1/learning/sessions`
- `POST /api/v1/quiz/generate`
- `POST /api/v1/quiz/submit`
- `GET /api/v1/quiz/history`
- `GET /api/v1/analytics/summary`

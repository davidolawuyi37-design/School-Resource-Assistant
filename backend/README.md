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
CLERK_SECRET_KEY=
CLERK_JWKS_URL=
LLM_API_KEY=
LLM_PROVIDER=deepseek
MODEL_NAME=deepseek-chat
LLM_BASE_URL=https://api.deepseek.com
LLM_TEMPERATURE=0.2
FRONTEND_ORIGINS=https://david-co.vercel.app
```

If `LLM_API_KEY` is empty, the backend returns local fallback lessons and quizzes so the frontend can still run.

## Routes

- `GET /api/v1/auth/me` - requires Clerk Bearer token
- `POST /api/v1/learning/tutor` - requires Clerk Bearer token
- `GET /api/v1/learning/sessions` - requires Clerk Bearer token
- `POST /api/v1/learning/sessions` - requires Clerk Bearer token
- `POST /api/v1/quiz/generate` - requires Clerk Bearer token
- `POST /api/v1/quiz/submit` - requires Clerk Bearer token
- `GET /api/v1/quiz/history` - requires Clerk Bearer token
- `GET /api/v1/analytics/summary` - requires Clerk Bearer token

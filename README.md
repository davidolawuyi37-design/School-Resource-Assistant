# DD World School Resource Assistant

A local AI education platform with a polished Next.js frontend and a FastAPI backend. Students can sign up, use the AI tutor workspace, generate quizzes, submit answers, review explanations, and view dashboard/history data.

No Docker is required.

## Folder Structure

```text
.
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── .env.example
└── Project.py
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Backend docs:

```text
http://localhost:8000/docs
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend:

```text
http://localhost:3000
```

## Environment Variables

Backend `backend/.env`:

```env
LLM_API_KEY=
LLM_PROVIDER=deepseek
MODEL_NAME=deepseek-chat
LLM_BASE_URL=https://api.deepseek.com
LLM_TEMPERATURE=0.2
```

Frontend `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

If `LLM_API_KEY` is empty, the backend uses local fallback tutor and quiz responses so the app still runs.

## API Routes

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

## Troubleshooting

- If the frontend says the backend is offline, start FastAPI with `uvicorn main:app --reload` inside `backend/`.
- If login fails after restarting the backend, sign up or log in again. Access tokens are local and simple for development.
- If AI provider calls fail, check `LLM_API_KEY`, `LLM_PROVIDER`, `MODEL_NAME`, and `LLM_BASE_URL`.
- If package install is slow on Windows, let `npm install` finish before running `npm run dev`.

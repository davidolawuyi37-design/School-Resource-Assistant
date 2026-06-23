# DD World School Resource Assistant

A local AI education platform with a polished Next.js frontend, Clerk authentication, and a FastAPI backend. Students can sign up, sign in with Google, use the AI tutor workspace, generate quizzes, submit answers, review explanations, and view dashboard/history data.

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
CLERK_SECRET_KEY=
CLERK_JWKS_URL=
LLM_API_KEY=
LLM_PROVIDER=deepseek
MODEL_NAME=deepseek-chat
LLM_BASE_URL=https://api.deepseek.com
LLM_TEMPERATURE=0.2
FRONTEND_ORIGINS=https://david-co.vercel.app
```

Frontend `frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_URL=https://david-co-backend.vercel.app/api/v1
```

If `LLM_API_KEY` is empty, the backend uses local fallback tutor and quiz responses so the app still runs.

## API Routes

All app data routes require `Authorization: Bearer <Clerk session token>`.

- `GET /api/v1/auth/me`
- `POST /api/v1/learning/tutor`
- `GET /api/v1/learning/sessions`
- `POST /api/v1/learning/sessions`
- `POST /api/v1/quiz/generate`
- `POST /api/v1/quiz/submit`
- `GET /api/v1/quiz/history`
- `GET /api/v1/analytics/summary`

## Troubleshooting

- If protected pages redirect, check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- If backend routes return 401, check `CLERK_JWKS_URL` and that the frontend is sending a Clerk session token.
- If AI provider calls fail, check `LLM_API_KEY`, `LLM_PROVIDER`, `MODEL_NAME`, and `LLM_BASE_URL`.
- If package install is slow on Windows, let `npm install` finish before running `npm run dev`.

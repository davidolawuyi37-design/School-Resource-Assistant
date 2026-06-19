from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analytics import router as analytics_router
from routes.auth import router as auth_router
from routes.learning import router as learning_router
from routes.quiz import router as quiz_router


app = FastAPI(
    title="DD World School Resource Assistant API",
    description="FastAPI backend for the AI education platform frontend.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://david-school-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


api_prefix = "/api/v1"
app.include_router(auth_router, prefix=api_prefix)
app.include_router(learning_router, prefix=api_prefix)
app.include_router(quiz_router, prefix=api_prefix)
app.include_router(analytics_router, prefix=api_prefix)

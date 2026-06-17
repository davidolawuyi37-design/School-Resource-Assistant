from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from models.schemas import LoginRequest, SignupRequest, TokenResponse, User
from services.session_store import store


router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer(auto_error=False)
TOKENS: dict[str, str] = {}


def create_token(email: str) -> str:
    token = str(uuid4())
    TOKENS[token] = email.lower()
    return token


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(security)) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing authorization token")

    email = TOKENS.get(credentials.credentials)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = store.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest):
    user = store.create_user(payload.full_name, payload.email, payload.password)
    return {"access_token": create_token(user.email)}


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = store.authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": create_token(user.email)}


@router.get("/me", response_model=User)
def me(user: User = Depends(get_current_user)):
    return user

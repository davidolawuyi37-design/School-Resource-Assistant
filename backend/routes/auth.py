from fastapi import APIRouter, Depends

from models.schemas import User
from services.clerk_auth import ClerkUser, require_clerk_user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=User)
def me(user: ClerkUser = Depends(require_clerk_user)):
    claims = user.claims
    return {
        "id": user.user_id,
        "full_name": claims.get("name") or claims.get("full_name") or "Student",
        "email": claims.get("email") or "",
        "role": "student",
    }

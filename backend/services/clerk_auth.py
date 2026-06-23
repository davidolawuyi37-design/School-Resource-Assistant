from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

load_dotenv()

security = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class ClerkUser:
    user_id: str
    claims: dict


@lru_cache(maxsize=1)
def get_jwks_client() -> PyJWKClient:
    jwks_url = os.getenv("CLERK_JWKS_URL")
    if not jwks_url:
        raise RuntimeError("CLERK_JWKS_URL is not configured")
    return PyJWKClient(jwks_url)


def verify_clerk_token(token: str) -> ClerkUser:
    try:
        signing_key = get_jwks_client().get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
    except Exception as error:
        raise HTTPException(status_code=401, detail="Invalid or expired Clerk token") from error

    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid Clerk token subject")

    return ClerkUser(user_id=user_id, claims=claims)


def require_clerk_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> ClerkUser:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing authorization token")
    return verify_clerk_token(credentials.credentials)

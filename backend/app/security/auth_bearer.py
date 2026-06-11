from fastapi import Depends
from fastapi import HTTPException

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from jose import jwt
from jose import JWTError

from app.config import (
    SECRET_KEY,
    ALGORITHM
)

security = HTTPBearer()


def verify_token(

    credentials:
    HTTPAuthorizationCredentials
    = Depends(security)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )


def admin_required(
    user=Depends(verify_token)
):

    if user.get("role") != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin Access Required"
        )

    return user


def student_required(
    user=Depends(verify_token)
):

    if user.get("role") != "student":

        raise HTTPException(
            status_code=403,
            detail="Student Access Required"
        )

    return user


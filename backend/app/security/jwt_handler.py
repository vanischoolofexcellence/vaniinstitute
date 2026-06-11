from jose import jwt
from datetime import datetime
from datetime import timedelta

from app.config import SECRET_KEY
from app.config import ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = 14400


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire,
        "type":"access"
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
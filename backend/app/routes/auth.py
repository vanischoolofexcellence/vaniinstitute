from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.admin import Admin

from app.schemas.admin_schema import (
    AdminCreate,
    AdminLogin
)
from fastapi import Request
from app.security.rate_limit import limiter


from app.security.hashing import (
    hash_password,
    verify_password
)

from app.security.jwt_handler import (
    create_access_token
)

router = APIRouter(

    prefix="/auth",

    tags=["Authentication"]
)


# @router.post("/admin/signup")

# def admin_signup(

    # admin: AdminCreate,

    # db: Session = Depends(get_db)
# ):

    # existing_admin = db.query(
        # Admin
    # ).filter(

        # Admin.email
        # ==
        # admin.email

    # ).first()

    # if existing_admin:

        # raise HTTPException(

            # status_code=400,

            # detail="Admin already exists"
        # )

    # new_admin = Admin(

        # name=admin.name,

        # email=admin.email,

        # hashed_password=hash_password(
            # admin.password
        # )
    # )

    # db.add(new_admin)

    # db.commit()

    # db.refresh(new_admin)

    # return {

        # "message":
        # "Admin Created Successfully"
    # }


@router.post("/admin/login")
@limiter.limit("5/minute")

def admin_login(
    request:Request,

    admin: AdminLogin,

    db: Session = Depends(get_db)
):

    db_admin = db.query(
        Admin
    ).filter(

        Admin.email
        ==
        admin.email

    ).first()

    if not db_admin:

        raise HTTPException(

            status_code=404,

            detail="Admin not found"
        )

    password_match = verify_password(

        admin.password,

        db_admin.hashed_password
    )

    if not password_match:

        raise HTTPException(

            status_code=401,

            detail="Invalid Password"
        )

    token = create_access_token(

        {

            "sub":
            db_admin.email,

            "role":
            "admin"
        }
    )

    return {

        "access_token":
        token,

        "token_type":
        "bearer"
    }
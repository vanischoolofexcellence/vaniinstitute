from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
# from secure import Secure


from sqlalchemy import text
from fastapi.middleware.cors import (
    CORSMiddleware
)
from fastapi.responses import (
    JSONResponse
)
from fastapi import Request

from app.database import (
    engine,
    Base
)

# Models
from app.models.admin import Admin
from app.models.student import Student
from app.models.attendance import Attendance
from app.models.marks import Marks
from app.models.fees import Fees
from app.models.message import Message
from app.models.gallery import Gallery

# Routes
from app.routes.auth import (
    router as auth_router
)

from app.routes.student import (
    router as student_router
)

from app.routes.attendance import (
    router as attendance_router
)

from app.routes.marks import (
    router as marks_router
)

from app.routes.fees import (
    router as fees_router
)

from app.routes.message import (
    router as message_router
)

from app.routes.gallery import (
    router as gallery_router
)

from app.routes.dashboard import (
    router as dashboard_router
)

from app.security.auth_bearer import (
    verify_token
)





# Create tables
Base.metadata.create_all(
    bind=engine
)

@asynccontextmanager
async def lifespan(app: FastAPI):

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        print("Database Connected")

    except Exception as e:
        print("Database Connection Failed", e)

    yield


app = FastAPI(
    lifespan=lifespan,

    docs_url="/docs",
    redoc_url="/redoc",

    title=
    "Vani Institute Management API",

    description=
    "Complete Institute Management Backend API for Admin & Students",

    version="1.0.0",

    contact={
        "name":
        "Mohammed Furqan",

        "email":
        "furqan@example.com"
    }
)
# from app.security.rate_limit import limiter
# app.state.limiter = limiter
# secure_headers=Secure()


# CORS
app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# @app.middleware("http")
# async def add_security_headers(
    # request,
    # call_next
# ):
    # response=await call_next(
        # request
    # )
    # secure_headers.framework.fastapi(
        # response
    # )
    # return response


# Routers
app.include_router(
    auth_router
)

app.include_router(
    student_router
)

app.include_router(
    attendance_router
)

app.include_router(
    marks_router
)

app.include_router(
    fees_router
)

app.include_router(
    message_router
)

app.include_router(
    gallery_router
)

app.include_router(
    dashboard_router
)


@app.get("/")
def root():

    return {
        "message":
        "Backend Running Successfully"
    }


@app.get("/db-test")
def db_test():

    try:

        with engine.connect() as connection:

            connection.execute(
                text("SELECT 1")
            )

        return {
            "database":
            "Connected Successfully"
        }

    except Exception as e:

        return {
            "error":
            "Internal Server Error"
        }


@app.get(
    "/admin/dashboard"
)
def admin_dashboard(
    token_data=Depends(
        verify_token
    )
):

    return {

        "message":
        "Welcome Admin Dashboard",

        "admin":
        token_data
    }


@app.exception_handler(
    Exception
)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    return JSONResponse(

        status_code=500,

        content={

            "success":
            False,

            "message":
            "Something went wrong",

            "error":
            str(exc)
        }
    )


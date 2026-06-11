from fastapi import APIRouter
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File
from fastapi import Form
from sqlalchemy.orm import Session
from datetime import datetime
import shutil
import os
import uuid

from app.database import get_db
from app.models.gallery import Gallery
from app.security.auth_bearer import (
    verify_token
)

router = APIRouter()


@router.post("/gallery/upload")
def upload_gallery(
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(verify_token)
):

    os.makedirs(
        "uploads/gallery/images",
        exist_ok=True
    )

    os.makedirs(
        "uploads/gallery/videos",
        exist_ok=True
    )

    file_extension = (
        file.filename.split(".")[-1]
    )

    image_extensions = [
        "jpg",
        "jpeg",
        "png"
    ]

    video_extensions = [
        "mp4",
        "mov",
        "avi"
    ]

    if file_extension.lower() in image_extensions:

        upload_path = (
            f"uploads/gallery/images/"
            f"{uuid.uuid4()}_{file.filename}"
        )

        file_type = "image"

    elif file_extension.lower() in video_extensions:

        upload_path = (
            f"uploads/gallery/videos/"
            f"{file.filename}"
        )

        file_type = "video"

    else:
        return {
            "message":
            "Unsupported file type"
        }

    with open(
        upload_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    new_file = Gallery(
        title=title,
        file_url=upload_path,
        file_type=file_type,
        created_at=datetime.utcnow()

    )

    db.add(new_file)
    db.commit()

    return {
        "message":
        "Uploaded Successfully"
    }


@router.get("/student/gallery")
def student_gallery(
    db: Session = Depends(get_db),
    student=Depends(verify_token)
):
    

    gallery = db.query(
        Gallery
    ).all()

    return gallery
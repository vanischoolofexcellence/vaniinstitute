from fastapi import APIRouter
from fastapi import Depends

from app.models.admin_log import AdminLog

from sqlalchemy.orm import Session
from app.schemas.message_schema import (
    MessageCreate
)
from app.database import get_db

from app.models.message import Message
from app.models.student import Student

from app.schemas.message_schema import (
    MessageCreate
)

from app.security.auth_bearer import (
    verify_token,
    student_required
)


router = APIRouter()


@router.post("/message/send")

def send_message(

    data: MessageCreate,

    db: Session = Depends(get_db),

    admin = Depends(verify_token)
):
    print(data)

    # SEND TO ALL

    if data.class_name == "all":

        students = db.query(
            Student
        ).all()

    # SEND TO SELECTED CLASS

    else:

        students = db.query(
            Student
        ).filter(

            Student.class_name
            ==
            data.class_name

        ).all()

    # SAVE MESSAGE FOR EACH STUDENT

    new_message =Message(
        title=data.title,
        message=data.message,
        class_name=data.class_name
    )
    db.add(new_message)

    db.commit()

    log = AdminLog(
        action=f"Message Sent:{data.title}"
    )
    db.add(log)
    db.commit

    return {

        "message":
        "Message Sent Successfully"
    }


@router.get("/student/messages")
def student_messages(

    db: Session = Depends(get_db),

    student = Depends(student_required)

):

    student_id = student.get(
        "sub"
    )

    current_student = db.query(
        Student
    ).filter(
        Student.id == int(student_id)
    ).first()

    if not current_student:

        return []

    messages = db.query(
        Message
    ).filter(

        Message.class_name.in_(

            [
                "all",
                current_student.class_name
            ]
        )

    ).order_by(

        Message.id.desc()

    ).all()

    return messages
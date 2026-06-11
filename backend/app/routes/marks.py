from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from datetime import datetime

from app.database import get_db

from app.models.marks import Marks

from app.models.student import Student

from app.schemas.marks_schema import (
    MarksCreate
)

from app.security.auth_bearer import (
    admin_required,
    student_required
)

router = APIRouter(
    prefix="/marks",
    tags=["Marks"]
)


# SAVE MARKS

@router.post("/save")
def save_marks(

    data: MarksCreate,

    db: Session = Depends(get_db),

    admin=Depends(admin_required)
):

    selected_date = datetime.strptime(
        data.date,
        "%Y-%m-%d"
    ).date()

    existing = db.query(
        Marks
    ).filter(

        Marks.student_id
        ==
        data.student_id,

        Marks.exam_name
        ==
        data.exam_name,

        Marks.subject
        ==
        data.subject,

        Marks.date
        ==
        selected_date

    ).first()

    if existing:

        existing.marks =data.marks
        

        db.commit()

        return {
            "message":
            "Marks Updated"
        }

    new_marks = Marks(

        student_id=data.student_id,
        

        exam_name=data.exam_name,
        

        subject=data.subject,
        

        marks= data.marks,
       

        date=selected_date
        
    )

    db.add(new_marks)

    db.commit()

    db.refresh(new_marks)

    return {
        "message":
        "Marks Saved"
    }


# GET CLASS MARKS

@router.get("/class/{class_name}")
def get_class_marks(

    class_name: str,

    exam_name: str,

    subject: str,

    date: str,

    db: Session = Depends(get_db),

    admin=Depends(admin_required)
):

    selected_date = datetime.strptime(
        date,
        "%Y-%m-%d"
    ).date()

    students = db.query(
        Student
    ).filter(
        Student.class_name
        ==
        class_name
    ).all()

    result = []

    for student in students:

        existing_marks = db.query(
            Marks
        ).filter(

            Marks.student_id
            ==
            student.id,

            Marks.exam_name
            ==
            exam_name,

            Marks.subject
            ==
            subject,

            Marks.date
            ==
            selected_date

        ).first()

        result.append({

            "id":
            student.id,

            "name":
            student.name,

            "marks":
            existing_marks.marks
            if existing_marks
            else ""
        })

    return result


# STUDENT MARKS HISTORY

@router.get("/student/history")
def student_marks(

    student=Depends(
        student_required
    ),

    db: Session = Depends(get_db)
):

    student_id = student.get(
        "sub"
    )

    marks = db.query(
        Marks
    ).filter(
        Marks.student_id
        ==
        int(student_id)
    ).all()

    return marks


# ALL EXAMS

@router.get("/all")
def all_marks(

    db: Session = Depends(get_db),

    admin=Depends(admin_required)
):

    marks = db.query(
        Marks
    ).all()

    return marks
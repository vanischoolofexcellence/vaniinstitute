from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from datetime import date

from datetime import datetime

from app.database import get_db

from app.models.attendance import Attendance

from app.models.student import Student

from app.schemas.attendance_schema import (
    AttendanceCreate
)

from app.security.auth_bearer import (
    admin_required,
    student_required
)

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


# MARK / UPDATE ATTENDANCE

@router.post("/mark")
def mark_attendance(

    data: AttendanceCreate,

    db: Session = Depends(get_db),

    admin=Depends(admin_required)
):

    attendance = db.query(
        Attendance
    ).filter(

        Attendance.student_id
        ==
        data.student_id,

        Attendance.date
        ==
        datetime.strptime(
            data.date,
            "%Y-%m-%d"
        ).date(),

        Attendance.time_slot
        ==
        data.time_slot

    ).first()

    # UPDATE EXISTING

    if attendance:

        attendance.status = (
            data.status
        )

        db.commit()

        return {
            "message":
            "Attendance Updated"
        }

    # CREATE NEW

    new_attendance = Attendance(

        student_id=
        data.student_id,

        date=
        datetime.strptime(
            data.date,
            "%Y-%m-%d"
        ).date(),

        time_slot=
        data.time_slot,

        status=
        data.status
    )

    db.add(new_attendance)

    db.commit()

    db.refresh(new_attendance)

    return {
        "message":
        "Attendance Saved"
    }


# GET CLASS ATTENDANCE BY DATE

@router.get("/class/{class_name}")
def get_class_attendance(

    class_name: str,

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

        morning = db.query(
            Attendance
        ).filter(

            Attendance.student_id
            ==
            student.id,

            Attendance.date
            ==
            selected_date,

            Attendance.time_slot
            ==
            "Morning"

        ).first()

        evening = db.query(
            Attendance
        ).filter(

            Attendance.student_id
            ==
            student.id,

            Attendance.date
            ==
            selected_date,

            Attendance.time_slot
            ==
            "Evening"

        ).first()

        result.append({

            "id":
            student.id,

            "name":
            student.name,

            "phone":
            student.phone,

            "morning":
            morning.status
            if morning
            else None,

            "evening":
            evening.status
            if evening
            else None
        })

    return result


# STUDENT ATTENDANCE HISTORY

@router.get("/student/history")
def student_attendance_history(

    student=Depends(
        student_required
    ),

    db: Session = Depends(get_db)
):

    student_id = student.get(
        "sub"
    )

    attendance = db.query(
        Attendance
    ).filter(
        Attendance.student_id
        ==
        int(student_id)
    ).all()

    return attendance


@router.get(
    "/student-summary/{student_id}"
)
def student_summary(

    student_id: int,

    db: Session = Depends(
        get_db
    ),

    admin=Depends(
        admin_required
    )
):

    student = db.query(
        Student
    ).filter(
        Student.id == student_id
    ).first()

    if not student:

        return {
            "error":
            "Student Not Found"
        }

    joining_date = (
        student.joining_date
    )

    academic_end = date(

        joining_date.year + 1,

        4,

        30
    )

    total_days = (
        academic_end -
        joining_date
    ).days

    morning_present = db.query(
        Attendance
    ).filter(

        Attendance.student_id
        == student_id,

        Attendance.time_slot
        == "Morning",

        Attendance.status
        == "Present"
    ).count()

    evening_present = db.query(
        Attendance
    ).filter(

        Attendance.student_id
        == student_id,

        Attendance.time_slot
        == "Evening",

        Attendance.status
        == "Present"
    ).count()

    return {

        "morning_present":
        morning_present,

        "evening_present":
        evening_present,

        "total_days":
        total_days
    }

@router.get("/student/my-summary")
def my_attendance_summary(

    student_data=Depends(student_required),

    db: Session = Depends(get_db)
):

    student_id = int(
        student_data["sub"]
    )

    student = db.query(
        Student
    ).filter(
        Student.id == student_id
    ).first()

    if not student:

        return {
            "error":
            "Student Not Found"
        }

    joining_date = (
        student.joining_date
    )

    academic_end = date(

        joining_date.year + 1,

        4,

        30
    )

    total_days = (
        academic_end -
        joining_date
    ).days

    morning_present = db.query(
        Attendance
    ).filter(

        Attendance.student_id
        == student_id,

        Attendance.time_slot
        == "Morning",

        Attendance.status
        == "Present"
    ).count()

    evening_present = db.query(
        Attendance
    ).filter(

        Attendance.student_id
        == student_id,

        Attendance.time_slot
        == "Evening",

        Attendance.status
        == "Present"
    ).count()

    return {

        "morning_present":
        morning_present,

        "evening_present":
        evening_present,

        "total_days":
        total_days
    }
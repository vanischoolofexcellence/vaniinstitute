from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.models.fees import Fees

from app.models.student import Student

from app.schemas.fees_schema import (
    FeesCreate
)

from app.security.auth_bearer import (
    admin_required,
    student_required
)

router = APIRouter(
    prefix="/fees",
    tags=["Fees"]
)


# SAVE / UPDATE FEES

@router.post("/save")

def save_fees(

    data: FeesCreate,

    db: Session = Depends(get_db),

    admin = Depends(admin_required)
):
    print(data)

    fee = Fees(

        student_id =
        data.student_id,

        student_name =
        data.student_name,

        student_class =
        data.student_class,

        date =
        data.date,

        month =
        data.month,

        amount =
        data.amount,

        payment_method =
        data.payment_method,

        status =
        data.status
    )

    db.add(fee)

    db.commit()
    db.refresh(fee)

    return {

        "message":
        "Payment Saved"
    }


@router.get(
    "/student/{student_id}"
)

def get_student_fees(

    student_id: int,

    db: Session = Depends(get_db),

    admin = Depends(
        admin_required
    )
):

    fees = db.query(
        Fees
    ).filter(

        Fees.student_id
        ==
        student_id

    ).all()

    return fees


# CLASS FEES

@router.get(
    "/class/{class_name}"
)

def get_class_fees(

    class_name: str,

    db: Session = Depends(get_db),

    admin = Depends(
        admin_required
    )
):

    students = db.query(
        Student
    ).filter(

        Student.class_name
        ==
        class_name

    ).all()

    return students


# STUDENT FEES

@router.get("/history")
def student_fee_history(

    student=Depends(
        student_required
    ),

    db: Session = Depends(get_db)
):

    student_id = student.get(
        "sub"
    )

    fees = db.query(
        Fees
    ).filter(
        Fees.student_id
        ==
        int(student_id)
    ).all()

    return fees

@router.get(
    "/student/{student_id}"
)

def get_student_fees(

    student_id: int,

    db: Session = Depends(get_db),

    admin = Depends(
        admin_required
    )
):

    fees = db.query(
        Fees
    ).filter(

        Fees.student_id
        ==
        student_id

    ).all()

    return fees
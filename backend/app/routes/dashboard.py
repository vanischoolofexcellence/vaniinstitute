from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

from app.database import get_db
from app.models.student import Student
from app.models.fees import Fees
from app.models.attendance import Attendance
from app.security.auth_bearer import (
    verify_token
)

router = APIRouter()


@router.get("/admin/analytics")
def dashboard_analytics(
    db: Session = Depends(get_db),
    admin=Depends(verify_token)
):

    total_students = db.query(
        Student
    ).count()

    total_classes = db.query(
        Student.class_name
    ).distinct().count()

    pending_fees = db.query(
        Fees
    ).filter(
        Fees.status == "Pending"
    ).count()

    paid_fees = db.query(
        Fees
    ).filter(
        Fees.status == "Paid"
    ).count()

    present_count = db.query(
        Attendance
    ).filter(
        Attendance.status == "Present"
    ).count()

    absent_count = db.query(
        Attendance
    ).filter(
        Attendance.status == "Absent"
    ).count()

    current_month = datetime.now().strftime("%B")
    monthly_revenue = db.query(
        func.sum(Fees.amount)
    ).filter(
        Fees.month == current_month
    ).scalar()

    if not monthly_revenue:
        monthly_revenue = 0

    return {
        "total_students":
        total_students,

        "total_classes":
        total_classes,

        "pending_fees":
        pending_fees,

        "paid_fees":
        paid_fees,

        "attendance": {
            "present":
            present_count,

            "absent":
            absent_count
        },
        "monthly_revenue":
        monthly_revenue
    }

@router.get("/admin/revenue/{month}")
def get_month_revenue(
    month:str,
    db:Session = Depends(get_db),
    admin=Depends(verify_token)
):
    revenue = db.query(
        func.sum(Fees.amount)
    ).filter(
        Fees.month==month
    ).scalar()

    return{
        "month":month,
        "revenue":revenue or 0
    }
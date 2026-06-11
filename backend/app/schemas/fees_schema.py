from pydantic import BaseModel


class FeesCreate(
    BaseModel
):

    student_id: int

    student_name: str

    student_class: str

    date: str

    month: str

    amount: str

    payment_method: str

    status: str
from pydantic import BaseModel


class AttendanceCreate(
    BaseModel
):

    student_id: int

    date: str

    time_slot: str

    status: str
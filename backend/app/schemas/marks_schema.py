from pydantic import BaseModel


class MarksCreate(
    BaseModel
):

    student_id: int

    exam_name: str

    subject: str

    marks: int

    date: str
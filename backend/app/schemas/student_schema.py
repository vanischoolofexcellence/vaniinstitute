from datetime import date
from pydantic import BaseModel
from pydantic import Field

class StudentCreate(BaseModel):
    name: str
    father_name: str
    phone: str=Field(
        min_length=10,
        max_length=10

    )
    class_name: str
    school_name: str
    joining_date: str
    address: str

class StudentUpdate(BaseModel):
    name: str
    father_name: str
    phone: str=Field(
        min_length=10,
        max_length=10
    )
    class_name: str
    school_name: str
    joining_date: str
    address: str

class StudentLogin(BaseModel):
    student_id: str
    password: str


class PasswordChange(
    BaseModel
):
    old_password: str
    new_password: str=Field(
        min_length=8
    )

class StudentResponse(BaseModel):

    id: int
    student_id: str
    name: str
    father_name: str
    phone: str
    class_name: str
    school_name: str

    address: str
    joining_date: date | None = None

    class Config:
        from_attributes = True
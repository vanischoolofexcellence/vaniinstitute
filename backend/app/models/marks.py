from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import Date

from app.database import Base


class Marks(Base):

    __tablename__ = "marks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("students.id")
    )

    exam_name = Column(String)

    subject = Column(String)

    marks = Column(Integer)

    date = Column(Date)
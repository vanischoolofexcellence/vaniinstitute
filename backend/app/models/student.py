from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Date
from sqlalchemy import DateTime
from sqlalchemy import Boolean

from app.database import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        String,
        unique=True,
        nullable=False
    )

    name = Column(String)

    father_name = Column(String)

    phone = Column(String)

    joining_date = Column(Date)

    class_name = Column(String)

    school_name = Column(String)

    address = Column(String)

    profile_image = Column(String)

    must_change_password = Column(
        Boolean,
        default=True
    )

    hashed_password = Column(String)

    failed_attempts =Column(
        Integer,
        default=0
    )
    
    locked_until = Column(
        DateTime,
        nullable=True
    )
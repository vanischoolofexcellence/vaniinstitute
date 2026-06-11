from sqlalchemy import *

from app.database import Base


class Fees(Base):

    __tablename__ = "fees"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer
    )

    student_name = Column(
        String
    )

    student_class = Column(
        String
    )

    date = Column(
        String
    )

    month = Column(
        String
    )

    amount = Column(
        Integer
    )

    payment_method = Column(
        String
    )

    status = Column(
        String
    )
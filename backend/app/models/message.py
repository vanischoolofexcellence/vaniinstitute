from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from datetime import datetime

from app.database import Base


class Message(Base):

    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )
    class_name=Column(
        String
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.database import Base


class AdminLog(Base):

    __tablename__ = "admin_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    

    action = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
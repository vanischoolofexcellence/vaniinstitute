from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from datetime import datetime

from app.database import Base


class Gallery(Base):

    __tablename__ = "gallery"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    file_url = Column(
        String,
        nullable=False
    )

    file_type = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    
    
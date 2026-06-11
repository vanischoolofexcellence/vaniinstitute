from app.database import engine
from app.database import Base

from app.models.admin import Admin
from app.models.student import Student


print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")
from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)

    region = Column(String(50), nullable=False)
    course_title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(Date, nullable=False)
    keyword = Column(String(100), nullable=False)

    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="courses")
    items = relationship("CourseItem", back_populates="course", cascade="all, delete-orphan")

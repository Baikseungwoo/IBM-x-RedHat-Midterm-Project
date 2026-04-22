from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.db.database import Base


class Course(Base):
    __tablename__ = "course"

    course_id = Column(Integer, primary_key=True, index=True)
    course_title = Column(String(100), nullable=False)
    course_content = Column(Text, nullable=True)
    course_location = Column(String(100), nullable=True)

    # 관계
    course_details = relationship("CourseDetail", back_populates="course", cascade="all, delete")
from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class CourseDetail(Base):
    __tablename__ = "course_detail"

    course_detail_id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("course.course_id"), nullable=False)

    course_detail_content = Column(Text, nullable=True)

    # 관계
    course = relationship("Course", back_populates="course_details")
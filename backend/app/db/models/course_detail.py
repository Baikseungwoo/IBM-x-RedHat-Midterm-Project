from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship

from app.db.database import Base


class CourseItem(Base):
    __tablename__ = "course_items"

    course_item_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.course_id", ondelete="CASCADE"), nullable=False, index=True)
    content_id = Column(Integer, ForeignKey("events.content_id", ondelete="RESTRICT"), nullable=False, index=True)
    sequence = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint("course_id", "sequence", name="uq_course_item_sequence"),
        UniqueConstraint("course_id", "content_id", name="uq_course_item_content"),
    )

    course = relationship("Course", back_populates="items")
    event = relationship("Event", back_populates="course_items")

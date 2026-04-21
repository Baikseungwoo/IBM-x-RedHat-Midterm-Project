from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class EventDetail(Base):
    __tablename__ = "event_details"

    intro_id = Column(Integer, primary_key=True, index=True)
    content_id = Column( Integer, ForeignKey("events.content_id", ondelete="CASCADE"), nullable=False,  unique=True )
    place = Column(String(255), nullable=True)
    homepage = Column(Text, nullable=True)
    play_time = Column(String(255), nullable=True)
    use_time_festival = Column(String(255), nullable=True)
    spend_time_festival = Column(String(255), nullable=True)
    booking_place = Column(String(255), nullable=True)
    age_limit = Column(String(100), nullable=True)
    place_info = Column(Text, nullable=True)
    program = Column(Text, nullable=True)
    sub_event = Column(Text, nullable=True)
    sponsor1 = Column(String(255), nullable=True)
    sponsor1_tel = Column(String(50), nullable=True)
    sponsor2 = Column(String(255), nullable=True)
    sponsor2_tel = Column(String(50), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)
    updated_at = Column(DateTime,server_default=func.now(),onupdate=func.now(), nullable=True  )

    event = relationship(
        "Event",
        back_populates="detail"
    )

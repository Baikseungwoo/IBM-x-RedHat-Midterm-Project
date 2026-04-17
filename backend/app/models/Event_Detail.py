from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class EventDetail(Base):
    __tablename__ = "event_details"

    event_detail_intro_id = Column(Integer, primary_key=True, index=True)
    event_detail_content_id = Column(  Integer,ForeignKey("events.event_content_id", ondelete="CASCADE"),
        nullable=False,
        unique=True
    )

    event_detail_event_place = Column(String(255), nullable=True)
    event_detail_event_homepage = Column(Text, nullable=True)
    event_detail_play_time = Column(String(255), nullable=True)
    event_detail_use_time_festival = Column(String(255), nullable=True)
    event_detail_spend_time_festival = Column(String(255), nullable=True)
    event_detail_booking_place = Column(String(255), nullable=True)
    event_detail_age_limit = Column(String(100), nullable=True)
    event_detail_place_info = Column(Text, nullable=True)
    event_detail_program = Column(Text, nullable=True)
    event_detail_sub_event = Column(Text, nullable=True)
    event_detail_sponsor1 = Column(String(255), nullable=True)
    event_detail_sponsor1_tel = Column(String(50), nullable=True)
    event_detail_sponsor2 = Column(String(255), nullable=True)
    event_detail_sponsor2_tel = Column(String(50), nullable=True)
    event_detail_created_at = Column(DateTime, server_default=func.now(), nullable=True)
    event_detail_updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    event = relationship(
        "Event",
        back_populates="detail"
    )
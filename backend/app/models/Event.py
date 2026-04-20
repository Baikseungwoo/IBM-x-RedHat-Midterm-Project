from sqlalchemy import Column, String, Date, DateTime, Integer, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Event(Base):
    __tablename__ = "events"

    event_content_id = Column(Integer, primary_key=True, index=True)
    event_content_type_id = Column(Integer, nullable=False)
    event_title = Column(String(255), nullable=False)
    event_addr1 = Column(String(255), nullable=True)
    event_addr2 = Column(String(255), nullable=True)
    event_region = Column(String(10), nullable=True)
    event_zipcode = Column(String(10), nullable=True)
    event_start_date = Column(Date, nullable=False)
    event_end_date = Column(Date, nullable=False)
    event_tel = Column(String(50), nullable=True)
    event_mapx = Column(DECIMAL(16, 13), nullable=True)
    event_mapy = Column(DECIMAL(16, 13), nullable=True)
    event_first_image = Column(String(500), nullable=True)
    event_first_image2 = Column(String(500), nullable=True)
    event_lcls_systm3 = Column(String(10), nullable=True)
    event_status = Column(String(50), nullable=True)
    event_like_count = Column(Integer, default=0, nullable=True)
    event_created_at = Column(DateTime, server_default=func.now(), nullable=True)
    event_bookmark_count = Column(Integer, default=0, nullable=True)

    detail = relationship(
        "EventDetail",
        back_populates="event",
        uselist=False,
        cascade="all, delete-orphan"
    )
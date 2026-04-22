from sqlalchemy import Column, String, Date, DateTime, Integer, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Event(Base):
    __tablename__ = "events"

    content_id = Column(Integer, primary_key=True, index=True)
    content_type_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    addr1 = Column(String(255), nullable=True)
    addr2 = Column(String(255), nullable=True)
    region = Column(String(10), nullable=True)
    zipcode = Column(String(10), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    tel = Column(String(50), nullable=True)
    mapx = Column(DECIMAL(16, 13), nullable=True)
    mapy = Column(DECIMAL(16, 13), nullable=True)
    first_image = Column(String(500), nullable=True)
    first_image2 = Column(String(500), nullable=True)
    lcls_systm3 = Column(String(10), nullable=True)
    status = Column(String(50), nullable=True)
    like_count = Column(Integer, default=0, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)
    bookmark_count = Column(Integer, default=0, nullable=True)

    detail = relationship(
        "EventDetail",
        back_populates="event",
        uselist=False,
        cascade="all, delete-orphan"
    )
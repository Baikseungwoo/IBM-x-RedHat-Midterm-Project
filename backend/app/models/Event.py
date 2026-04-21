from sqlalchemy import Column, Integer, String, Date, DateTime, Text, func
from app.db.database import Base


# 행사 정보
class Event(Base):
    __tablename__ = "event"

    event_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    region = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    place = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    like_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

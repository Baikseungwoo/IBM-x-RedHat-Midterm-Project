from app.db.database import Base
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, CheckConstraint
from .user import User
from .event import Event

class Review(Base):
    __tablename__="reviews"
    review_id=Column(Integer, primary_key=True)
    user_id=Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    content_id=Column(Integer, ForeignKey("events.content_id", ondelete="CASCADE"), nullable=False)
    content=Column(Text, nullable=False)
    rating=Column(Integer, nullable=False)
    created_at=Column(DateTime, default=datetime.utcnow)
    updated_at=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),
    )

    user:Mapped["User"]=relationship("User", back_populates="reviews")
    event:Mapped["Event"]=relationship("Event", back_populates="reviews")
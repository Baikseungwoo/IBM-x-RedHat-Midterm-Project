from database import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .user import User
from .event import Event

class Bookmark(Base):
    __tablename__="bookmarks"
    bookmark_id=Column(Integer, primary_key=True)
    user_id=Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    content_id=Column(Integer, ForeignKey("events.content_id", ondelete="CASCADE"), nullable=False)
    created_at=Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('user_id', 'content_id', name='uq_bookmark_user_content'),
    )

    user:Mapped["User"]=relationship("User", back_populates="bookmarks")
    event:Mapped["Event"]=relationship("Event", back_populates="bookmarks")
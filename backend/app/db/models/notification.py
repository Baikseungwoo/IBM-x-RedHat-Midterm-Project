from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    title = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="notifications")

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    inquiry_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(20), nullable=False, default="pending")
    admin_reply = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    answered_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="inquiries")

    @property
    def user_nickname(self) -> str | None:
        return self.user.nickname if self.user else None

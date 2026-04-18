from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.dialects.mysql import LONGBLOB
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    nickname = Column(String(50), nullable=False, index=True)
    refresh_token = Column(String(255), nullable=False, default="")
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    image_data = Column(LONGBLOB, nullable=True)

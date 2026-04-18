from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional

# 리뷰 생성
class ReviewCreate(BaseModel):
    content: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)

# 리뷰 수정
class ReviewUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1)
    rating: Optional[int] = Field(None, ge=1, le=5)

# 리뷰 응답
class ReviewResponse(BaseModel):
    review_id: int
    user_id: int
    content_id: int
    content: str
    rating: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
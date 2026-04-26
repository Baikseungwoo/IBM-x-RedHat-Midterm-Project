from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

# 좋아요 응답
class LikeResponse(BaseModel):
    like_id: int
    user_id: int
    content_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

# 북마크 응답
class BookmarkResponse(BaseModel):
    bookmark_id: int
    user_id: int
    content_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)